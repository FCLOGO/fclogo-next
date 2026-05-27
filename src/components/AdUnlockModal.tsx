'use client';

import { useEffect, useMemo, useState } from 'react';
import AdUnit from '@/components/AdUnit';
import { useLocale } from 'next-intl';
import Logo from '@/components/_icons/FCLOGO';
import { X } from 'lucide-react';

const STORAGE_KEY = 'fclogo_ad_unlock_until_v1';
const UNLOCK_HOURS = 24;
const AD_SECONDS = 12;
const FIRST_SHOW_DELAY_MS = 15000;

type Step = 'gate' | 'ad';

export default function AdUnlockModal() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>('gate');
  const [elapsed, setElapsed] = useState(0);

  const copy = useMemo(() => {
    if (locale === 'zh-cn') {
      return {
        title: '解锁更多内容',
        description: '请做出选择以继续访问网站内容',
        watch: '观看一则短广告',
        tip: '观看后获得 24 小时网站访问权限',
        adLabel: '广告',
      };
    }
    return {
      title: 'Unlock More Content',
      description: 'Please make a selection to continue browsing.',
      watch: 'Watch one short ad',
      tip: 'Unlock 24-hour site access after watching.',
      adLabel: 'Ad',
    };
  }, [locale]);

  useEffect(() => {
    let delayTimer: number | undefined;
    const unlockUntil = Number(window.localStorage.getItem(STORAGE_KEY) || '0');
    if (!unlockUntil || Date.now() > unlockUntil) {
      delayTimer = window.setTimeout(() => {
        setVisible(true);
      }, FIRST_SHOW_DELAY_MS);
    }
    return () => {
      if (delayTimer) {
        window.clearTimeout(delayTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || step !== 'ad' || elapsed >= AD_SECONDS) {
      return;
    }
    const timer = window.setInterval(() => {
      setElapsed((prev) => Math.min(prev + 0.1, AD_SECONDS));
    }, 100);
    return () => window.clearInterval(timer);
  }, [visible, step, elapsed]);

  const startWatching = () => {
    setStep('ad');
    setElapsed(0);
  };

  const unlockAndClose = () => {
    const unlockUntil = Date.now() + UNLOCK_HOURS * 60 * 60 * 1000;
    window.localStorage.setItem(STORAGE_KEY, unlockUntil.toString());
    setVisible(false);
    setStep('gate');
    setElapsed(0);
  };

  if (!visible) {
    return null;
  }

  const progress = Math.min((elapsed / AD_SECONDS) * 100, 100);
  const canCloseAd = progress >= 100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-[1px]">
      {step === 'gate' && (
        <div className="w-full max-w-xl rounded-3xl bg-base-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="my-8 flex justify-center">
            <Logo className="h-6 w-auto [&_>.path-2]:fill-success fill-primary" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight">{copy.title}</h2>
          <p className="mt-2 text-center text-base-content/70">{copy.description}</p>

          <button className="btn btn-xl mt-6 h-auto w-full rounded-xl bg-base-200 py-2 text-base-content hover:bg-base-300" onClick={startWatching}>
            <span className="flex w-full flex-col items-center justify-center">
              <span className="text-base font-semibold">{copy.watch}</span>
              <span className="text-sm text-base-content/60">{copy.tip}</span>
            </span>
          </button>
        </div>
      )}

      {step === 'ad' && (
        <div className="relative w-full max-w-[1400px] overflow-hidden rounded-xl border-2 border-white/90 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="h-1 w-full bg-base-200">
            <div
              className="h-full bg-success transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {canCloseAd && (
            <button
              type="button"
              onClick={unlockAndClose}
              className="absolute right-3 top-3 z-20 cursor-pointer rounded-full bg-black/75 p-2 text-white hover:bg-black"
              aria-label={locale === 'zh-cn' ? '关闭' : 'Close'}
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="min-h-[72vh] p-0">
            <AdUnit
              adSlot="4659989839"
              adFormat="auto"
              className="h-full min-h-[72vh] w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
