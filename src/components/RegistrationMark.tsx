type Props = {
  className?: string;
  label?: string;
};

/**
 * The printer's registration mark. It is the identity's smallest unit: it
 * appears on the sheet in the loader, on the curtain between pages, in the
 * corner of the frame and beside section labels.
 */
export function RegistrationMark({ className = "", label }: Props) {
  return (
    <span className={`regmark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none">
        <circle cx="24" cy="24" r="10.5" stroke="currentColor" strokeWidth="0.8" />
        <circle className="regmark__dot" cx="24" cy="24" r="2.6" fill="currentColor" />
        <path d="M24 0v16M24 32v16M0 24h16M32 24h16" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      {label ? <span className="regmark__label">{label}</span> : null}
    </span>
  );
}
