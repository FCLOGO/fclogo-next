import { PortableText as SanityPortableText } from '@portabletext/react';
import type { PortableText as PortableTextType } from '@/types';

interface RichTextBlockProps {
  content: PortableTextType;
}

export default function RichTextBlock({ content }: RichTextBlockProps) {
  return (
    <div className="prose max-w-none bg-base-100 rounded-lg px-12 py-16 shadow-box">
      <SanityPortableText value={content} />
    </div>
  );
}