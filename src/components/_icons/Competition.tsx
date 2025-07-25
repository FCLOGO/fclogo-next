import React from 'react';

interface IconProps {
  className?: string;
}

export default function CompIcon({ className }: IconProps) {
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
      <path d="M366.7,64c0,0,0,123.1,0,166.5S329.3,349.3,256,349.3h0c-73.3,0-110.7-75.3-110.7-118.7s0-166.5,0-166.5H256
        H366.7z"/>
      <path d="M145.3,112.5H64c0,0,0,69.6,0,98s2.4,113.7,125.9,113.7"/>
      <path d="M366.7,112.5H448c0,0,0,69.6,0,98s-2.4,113.7-125.9,113.7"/>
      <path d="M356,448H156v-12c0-19.8,16.2-36,36-36h128c19.8,0,36,16.2,36,36V448z"/>
      <line x1="256" y1="349.3" x2="256" y2="400"/>
      <line x1="366.7" y1="64" x2="189.9" y2="324.1"/>
    </svg>
  );
}