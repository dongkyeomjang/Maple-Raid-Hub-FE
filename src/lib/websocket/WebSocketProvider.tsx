"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// STOMP 프레임 타입
interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body: string;
}

// 구독 콜백 타입
type MessageCallback = (message: unknown) => void;

interface Subscription {
  id: string;
  destination: string;
  callback: MessageCallback;
}

interface WebSocketContextType {
  connected: boolean;
  connecting: boolean;
  subscribe: (destination: string, callback: MessageCallback) => string;
  unsubscribe: (subscriptionId: string) => void;
  send: (destination: string, body: object, headers?: Record<string, string>) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

// STOMP 프레임 파싱
function parseStompFrame(data: string): StompFrame | null {
  const lines = data.split("\n");
  const command = lines[0];

  if (!command) return null;

  const headers: Record<string, string> = {};
  let i = 1;

  // 헤더 파싱
  while (i < lines.length && lines[i] !== "") {
    const line = lines[i];
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);
      headers[key] = value;
    }
    i++;
  }

  // 빈 줄 건너뛰기
  i++;

  // 본문
  const body = lines.slice(i).join("\n").replace(/\0$/, "");

  return { command, headers, body };
}

// STOMP 프레임 직렬화
function serializeStompFrame(command: string, headers: Record<string, string>, body = ""): string {
  let frame = command + "\n";

  for (const [key, value] of Object.entries(headers)) {
    frame += `${key}:${value}\n`;
  }

  frame += "\n";
  frame += body;
  frame += "\0";

  return frame;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionsRef = useRef<Map<string, Subscription>>(new Map());
  const subscriptionIdCounterRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    setConnecting(false);
  }, []);

  const connect = useCallback(() => {
    if (!user || wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnecting(true);

    // SockJS 스타일 WebSocket URL
    const wsUrl = `${API_URL.replace(/^http/, "ws")}/ws/websocket`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // STOMP CONNECT 프레임 전송 (인증은 쿠키로 핸드셰이크 시 처리됨)
        const connectFrame = serializeStompFrame("CONNECT", {
          "accept-version": "1.2",
          "heart-beat": "10000,10000",
        });
        ws.send(connectFrame);
      };

      ws.onmessage = (event) => {
        const frame = parseStompFrame(event.data);
        if (!frame) return;

        switch (frame.command) {
          case "CONNECTED":
            setConnected(true);
            setConnecting(false);

            // 하트비트 시작
            heartbeatIntervalRef.current = setInterval(() => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send("\n");
              }
            }, 10000);

            // 기존 구독 복원
            subscriptionsRef.current.forEach((sub) => {
              const subscribeFrame = serializeStompFrame("SUBSCRIBE", {
                id: sub.id,
                destination: sub.destination,
              });
              ws.send(subscribeFrame);
            });
            break;

          case "MESSAGE":
            const subscriptionId = frame.headers["subscription"];
            const sub = subscriptionsRef.current.get(subscriptionId);
            if (sub) {
              try {
                const message = JSON.parse(frame.body);
                sub.callback(message);
              } catch {
                sub.callback(frame.body);
              }
            }
            break;

          case "ERROR":
            console.error("[STOMP] Error:", frame.body);
            break;
        }
      };

      ws.onclose = () => {
        setConnected(false);
        setConnecting(false);

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        // 재연결 시도
        if (user) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
      };
    } catch (error) {
      console.error("[WebSocket] Connection failed:", error);
      setConnecting(false);
    }
  }, [user]);

  // 유저 로그인 시 연결
  useEffect(() => {
    if (user) {
      connect();
    } else {
      cleanup();
    }

    return cleanup;
  }, [user, connect, cleanup]);

  const subscribe = useCallback((destination: string, callback: MessageCallback): string => {
    const id = `sub-${subscriptionIdCounterRef.current++}`;

    subscriptionsRef.current.set(id, { id, destination, callback });

    // 이미 연결된 상태면 바로 구독
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const subscribeFrame = serializeStompFrame("SUBSCRIBE", {
        id,
        destination,
      });
      wsRef.current.send(subscribeFrame);
    }

    return id;
  }, []);

  const unsubscribe = useCallback((subscriptionId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const unsubscribeFrame = serializeStompFrame("UNSUBSCRIBE", {
        id: subscriptionId,
      });
      wsRef.current.send(unsubscribeFrame);
    }

    subscriptionsRef.current.delete(subscriptionId);
  }, []);

  const send = useCallback(
    (destination: string, body: object, headers: Record<string, string> = {}) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        console.warn("[WebSocket] Cannot send: not connected");
        return;
      }

      const sendFrame = serializeStompFrame(
        "SEND",
        {
          destination,
          "content-type": "application/json",
          ...headers,
        },
        JSON.stringify(body)
      );
      wsRef.current.send(sendFrame);
    },
    []
  );

  const value: WebSocketContextType = {
    connected,
    connecting,
    subscribe,
    unsubscribe,
    send,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
