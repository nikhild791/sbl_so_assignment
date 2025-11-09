import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  const base =
    "block w-full p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition-colors sm:p-5 dark:bg-gray-900 dark:border-gray-800";

  // fix: removed stray quote and keep utm query
  const targetHref = `${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`;

  return (
    <a
      className={className ? `${base} ${className}` : base}
      href={targetHref}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {title}
        </h3>
        <span className="text-gray-400" aria-hidden>
          →
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {children}
      </p>
    </a>
  );
}
