/** Renders CMS rich-text HTML or plain text. */
export function RichHtml({ html, className = '' }: { html: string; className?: string }) {
  const trimmed = html?.trim() ?? '';
  if (!trimmed) {
    return null;
  }
  if (!trimmed.includes('<')) {
    return <p className={className}>{trimmed}</p>;
  }
  return (
    <div
      className={`rich-html ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
}
