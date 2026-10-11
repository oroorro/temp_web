interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <ul className="tag-list" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="tag">
          #{tag}
        </li>
      ))}
    </ul>
  );
}
