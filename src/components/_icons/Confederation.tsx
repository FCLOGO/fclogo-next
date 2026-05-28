import React from 'react';

interface IconProps {
  className?: string;
}

export default function ConfederationIcon({ className }: IconProps) {
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
      <circle cx="256" cy="256" r="192" />
      <ellipse cx="256" cy="256" rx="192" ry="73.0435" />
      <ellipse cx="256" cy="256" rx="73.0435" ry="192" />
      <circle cx="256" cy="256" r="25.0435" />
    </svg>
  );
}
