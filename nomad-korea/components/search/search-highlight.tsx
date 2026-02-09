interface SearchHighlightProps {
  text: string;
  query: string;
}

/**
 * 검색어가 포함된 텍스트를 하이라이팅합니다
 */
export function SearchHighlight({ text, query }: SearchHighlightProps) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return <>{text}</>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + normalizedQuery.length);
  const after = text.slice(index + normalizedQuery.length);

  return (
    <>
      {before}
      <mark className="bg-yellow-200 text-foreground font-medium">{match}</mark>
      {after}
    </>
  );
}
