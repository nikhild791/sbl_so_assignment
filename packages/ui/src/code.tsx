import { type JSX } from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const base =
    "font-mono text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded";
  return (
    <code className={className ? `${base} ${className}` : base}>
      {children}
    </code>
  );
}
