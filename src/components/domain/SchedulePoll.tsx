"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { PollResponse } from "@/types/api";
import { formatDateTime, cn } from "@/lib/utils";
import { Calendar, Plus, Vote, Check, Clock } from "lucide-react";

interface SchedulePollProps {
  poll: PollResponse | null;
  onCreatePoll: (options: string[]) => void;
  onVote: (optionIndex: number) => void;
  currentUserId: string;
  isLeader: boolean;
  isCreating?: boolean;
  isVoting?: boolean;
}

export function SchedulePoll({
  poll,
  onCreatePoll,
  onVote,
  currentUserId,
  isLeader,
  isCreating,
  isVoting,
}: SchedulePollProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newOptions, setNewOptions] = useState<string[]>(["", ""]);

  const handleAddOption = () => {
    if (newOptions.length < 5) {
      setNewOptions([...newOptions, ""]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const handleCreatePoll = () => {
    const validOptions = newOptions.filter((opt) => opt.trim());
    if (validOptions.length >= 2) {
      onCreatePoll(validOptions);
      setIsCreatingNew(false);
      setNewOptions(["", ""]);
    }
  };

  const totalVotes = poll?.options.reduce((acc, opt) => acc + opt.votes.length, 0) || 0;

  if (isCreatingNew) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            일정 투표 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {newOptions.map((option, index) => (
            <div key={index} className="space-y-1">
              <Label>옵션 {index + 1}</Label>
              <Input
                type="datetime-local"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
          ))}

          {newOptions.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              옵션 추가
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleCreatePoll}
              disabled={
                isCreating ||
                newOptions.filter((opt) => opt.trim()).length < 2
              }
              className="flex-1"
            >
              투표 생성
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreatingNew(false)}
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            일정 투표
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLeader ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                아직 일정 투표가 없습니다
              </p>
              <Button onClick={() => setIsCreatingNew(true)}>
                <Vote className="h-4 w-4 mr-2" />
                투표 생성하기
              </Button>
            </div>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              파티장이 일정 투표를 생성하면 여기에 표시됩니다
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  const hasVoted = poll.options.some((opt) => opt.votes.includes(currentUserId));
  const myVoteIndex = poll.options.findIndex((opt) =>
    opt.votes.includes(currentUserId)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            일정 투표
          </span>
          {poll.isActive ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              진행 중
            </span>
          ) : (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              종료됨
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option, index) => {
          const votePercent = totalVotes > 0
            ? (option.votes.length / totalVotes) * 100
            : 0;
          const isMyVote = myVoteIndex === index;

          return (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                isMyVote
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              )}
              onClick={() => poll.isActive && onVote(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isMyVote && <Check className="h-4 w-4 text-primary" />}
                  <span className="font-medium">
                    {formatDateTime(option.datetime)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {option.votes.length}표
                </span>
              </div>
              <Progress value={votePercent} className="h-2" />
            </div>
          );
        })}

        {!poll.isActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            투표가 종료되었습니다
          </div>
        )}
      </CardContent>
    </Card>
  );
}
