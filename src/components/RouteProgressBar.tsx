'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

const START_PROGRESS = 18;
const MAX_PROGRESS_BEFORE_DONE = 92;
const COMPLETE_PROGRESS = 100;
const COMPLETE_HIDE_DELAY = 180;
const TICK_INTERVAL = 120;

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isInternalLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return false;
  }

  const target = anchor.getAttribute('target');
  if (target && target !== '_self') {
    return false;
  }

  if (anchor.hasAttribute('download')) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const activeRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const didMountRef = useRef(false);

  const finishProgress = () => {
    activeRef.current = false;

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setProgress(COMPLETE_PROGRESS);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, COMPLETE_HIDE_DELAY);
  };

  const startProgress = () => {
    if (activeRef.current) {
      return;
    }

    activeRef.current = true;
    setVisible(true);
    setProgress(START_PROGRESS);

    intervalRef.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= MAX_PROGRESS_BEFORE_DONE) {
          return current;
        }

        const next = current + Math.max(2, Math.round((MAX_PROGRESS_BEFORE_DONE - current) * 0.12));
        return Math.min(next, MAX_PROGRESS_BEFORE_DONE);
      });
    }, TICK_INTERVAL);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || !isInternalLink(anchor)) {
        return;
      }

      const url = new URL(anchor.getAttribute('href') ?? '', window.location.href);
      const current = `${window.location.pathname}${window.location.search}`;
      const next = `${url.pathname}${url.search}`;

      if (current === next) {
        return;
      }

      startProgress();
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (activeRef.current) {
      setProgress(COMPLETE_PROGRESS);
      finishProgress();
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-full"
    >
      <div
        className="h-full bg-success transition-[transform,opacity,width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        }}
      />
    </div>
  );
}
