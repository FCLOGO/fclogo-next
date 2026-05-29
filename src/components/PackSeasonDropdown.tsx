'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CalendarDays, ChevronDown } from 'lucide-react';

type SeasonItem = {
  key: string;
  count: number;
};

type Props = {
  basePath: string;
  selectedNationCode?: string;
  selectedSeason?: string;
  allPacksLabel: string;
  selectedSeasonLabel: string;
  selectedSeasonCount: number;
  totalPacksCount: number;
  seasons: SeasonItem[];
};

export default function PackSeasonDropdown({
  basePath,
  selectedNationCode,
  selectedSeason,
  allPacksLabel,
  selectedSeasonLabel,
  selectedSeasonCount,
  totalPacksCount,
  seasons,
}: Props) {
  const [open, setOpen] = useState(false);

  const buildHref = (nationCode?: string | null, season?: string | null) => {
    const params = new URLSearchParams();

    if (nationCode) {
      params.set('nation', nationCode);
    }

    if (season) {
      params.set('season', season);
    }

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const toggleSeasonHref = (season: string) => {
    const nextSeason = selectedSeason === season ? null : season;
    return buildHref(selectedNationCode ?? null, nextSeason);
  };

  return (
    <details className="dropdown dropdown-bottom w-full" open={open}>
      <summary
        className="flex list-none cursor-pointer items-center justify-between gap-3 rounded border border-base-300 bg-base-100 px-3 py-2 text-left transition-colors hover:border-success hover:bg-success/5"
        onClick={(event) => {
          event.preventDefault();
          setOpen((value) => !value);
        }}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-5 w-5 shrink-0 text-success stroke-[1.5]" />
          <span className="min-w-0 truncate text-sm font-semibold">{selectedSeasonLabel}</span>
          <span className="rounded-full bg-neutral/5 px-2 py-0.5 text-xs font-mono text-base-content/60">
            {selectedSeasonCount}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-base-content/50" />
      </summary>

      <ul className="menu dropdown-content z-20 mt-2 max-h-72 w-full overflow-y-auto space-y-0.5 rounded-box bg-base-100 p-2 shadow-lg">
        <li>
          <Link
            href={buildHref(null, null)}
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between py-1.5 ${
              !selectedNationCode && !selectedSeason ? 'active' : ''
            }`}
          >
            <span>{allPacksLabel}</span>
            <span className="font-mono text-xs opacity-60">{totalPacksCount}</span>
          </Link>
        </li>
        {seasons.map((item) => {
          const active = selectedSeason === item.key;

          return (
            <li key={item.key}>
              <Link
                href={toggleSeasonHref(item.key)}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between py-1.5 ${active ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-success stroke-[1.5]" />
                  <span className="font-mono font-semibold">{item.key}</span>
                </span>
                <span className="font-mono text-xs opacity-60">{item.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
