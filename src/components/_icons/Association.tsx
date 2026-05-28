import React from 'react';

interface IconProps {
  className?: string;
}

export default function AssociationIcon({ className }: IconProps) {
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
  <path d="M256,64l-177.2308,59.0769v118.1538c0,125.5385,177.2308,206.7692,177.2308,206.7692,0,0,177.2308-81.2308,177.2308-206.7692v-118.1538l-177.2308-59.0769Z" />
  <circle cx="256" cy="256" r="96" />
  <polygon points="256 215.5789 294.7692 244.1457 280.4858 289.0364 231.5142 289.0364 217.2308 244.1457 256 215.5789" />
  <path d="M256,215.5789v-55.5789M294.7692,244.1457l51.6923-17.6842M280.4858,289.0364l30.8988,44.502M231.5142,289.0364l-30.8988,44.502M217.2308,244.1457l-51.6923-17.6842" />
  <line x1="213.97" y1="342.33" x2="165.83" y2="390.47" />
  <line x1="433.23" y1="123.08" x2="342.34" y2="213.97" />
  <line x1="168.76" y1="296.12" x2="120.12" y2="344.76" />
  <line x1="364.66" y1="100.22" x2="296.12" y2="168.76" />
    </svg>
  );
}
