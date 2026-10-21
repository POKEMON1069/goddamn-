type LabelProps = {
  children: React.ReactNode;
  note?: string;
  as?: "p" | "h2" | "h3" | "span";
};

export function Label({ children, note, as: Tag = "p" }: LabelProps) {
  return (
    <Tag className="label">
      <span className="label__rule" aria-hidden="true" />
      <span className="label__text">{children}</span>
      {note ? <span className="label__note mono-xs">{note}</span> : null}
    </Tag>
  );
}
