'use client';
import { useEffect } from 'react';

type ShortcutCallback = (event: KeyboardEvent) => void;

export function useShortcut(
  key: string,
  callback: ShortcutCallback,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const mainKeyPressed = event.key.toLowerCase() === key.toLowerCase();
      const ctrlPressed = options.ctrl ? event.ctrlKey : true;
      const metaPressed = options.meta ? event.metaKey : true; // Meta is Command on Mac
      const shiftPressed = options.shift ? event.shiftKey : true;

      if (mainKeyPressed && ctrlPressed && metaPressed && shiftPressed) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, options]);
}