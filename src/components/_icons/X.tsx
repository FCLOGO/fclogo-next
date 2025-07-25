import React from 'react';

interface IconProps {
  className?: string;
}

export default function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className} 
    >
      <g><path d="M300.7,219.2L475.5,16h-41.4L282.3,192.5L161,16H21.2l183.4,266.9L21.2,496h41.4l160.3-186.4L351,496h139.9L300.7,219.2
		L300.7,219.2z M243.9,285.2l-18.6-26.6L77.5,47.2h63.6l119.3,170.6l18.6,26.6l155.1,221.8h-63.6L243.9,285.2L243.9,285.2z"/></g>
    </svg>
  );
}