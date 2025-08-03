'use client';
import React from 'react';

type Props = {
  pageSlogan: string;
  subTitle?: string;
};

export default function PageHero({ pageSlogan, subTitle }: Props) {
  return (
    <div className="hero min-h-64 bg-gradient-to-b from-primary to-secondary text-primary-content">
      <div className="container m-auto p-6 max-w-5xl h-full flex flex-col justify-center items-center">
        <p className="uppercase font-semibold text-3xl text-center tracking-wider leading-loose">
          {pageSlogan}
        </p>
        {subTitle && (
          <p className="uppercase font-semibold text-center text-lg mt-md tracking-wider">{subTitle}</p>
        )}
      </div>
    </div>
  )
}