import React from 'react';

interface IconProps {
  className?: string;
}

export default function NationIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="64" y1="130.9" x2="149" y2="448"/>
      <path d="M75.4,173.3c0,0,33.5-65.4,85-72.1c51.5-6.7,89.1,2,124.4,3.3s65.9-3.1,110.4-40.5c0,0,6,22.8-20,128.1
        c0,0,25.1,32,72.8,54.7c0,0-18.3,57.9-112.7,51.9c-94.4-6-147.5-24.4-207.3,71.1"/>
      <line x1="265.6" y1="103.2" x2="317.7" y2="297.4"/>
      <line x1="194.5" y1="98.7" x2="246.6" y2="293"/>
    </svg>
  );
}