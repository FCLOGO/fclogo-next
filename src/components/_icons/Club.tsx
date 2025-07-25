import React from 'react';

interface IconProps {
  className?: string;
}

export default function ClubIcon({ className }: IconProps) {
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
      <path d="M424,192.3H88c-13.2,0-24-10.8-24-24v0c0-13.2,10.8-24,24-24h336c13.2,0,24,10.8,24,24v0
        C448,181.5,437.2,192.3,424,192.3z"/>
      <polyline points="116.5,144.3 256.5,64 395.6,144.3 "/>
      <polygon points="116.5,385.2 395.5,192.3 395.5,385.2 256,448 116.5,385.2 116.5,192.3 "/>
    </svg>
  );
}