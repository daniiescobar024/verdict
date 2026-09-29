import { Fragment, type ReactNode } from 'react';

const TOKEN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|`([^`]+)`/g;

/**
 * Lighthouse descriptions use a sliver of Markdown: links and inline code.
 * Rendering them as React nodes (not innerHTML) keeps the report XSS-safe.
 */
export function RichText({ text, linkLabel }: { text: string; linkLabel?: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index;
    if (index > cursor) nodes.push(text.slice(cursor, index));
    const [, label, href, code] = match;
    if (href) {
      const isLearnMore = /learn|más|more/i.test(label ?? '');
      nodes.push(
        <a key={index} href={href} target="_blank" rel="noreferrer noopener">
          {isLearnMore && linkLabel ? linkLabel : label}
        </a>,
      );
    } else if (code) {
      nodes.push(<code key={index}>{code}</code>);
    }
    cursor = index + match[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <Fragment>{nodes}</Fragment>;
}
