import { useState, useCallback } from "react";

/**
 * 비밀번호 입력 필드에서 CapsLock 상태를 감지하는 훅
 */
export function useCapsLock() {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyEvent = useCallback((e: React.KeyboardEvent) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"));
  }, []);

  const capsLockProps = {
    onKeyDown: handleKeyEvent,
    onKeyUp: handleKeyEvent,
  };

  return { isCapsLockOn, capsLockProps };
}
