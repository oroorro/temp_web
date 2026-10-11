interface SchemaIssueProps {
  type: string;
  problems: string[];
}

/** Stands in for a declared node that could not be rendered, so mistakes in the JSON are easy to spot. */
export function SchemaIssue({ type, problems }: SchemaIssueProps) {
  return (
    <div className="schema-issue" role="alert">
      <strong>Cannot render “{type}”</strong>
      <ul>
        {problems.map((problem) => (
          <li key={problem}>{problem}</li>
        ))}
      </ul>
    </div>
  );
}
