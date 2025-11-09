"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  const base =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400";

  const defaultClasses = `${base} bg-gray-900 text-white hover:bg-gray-800 focus:ring-offset-white dark:focus:ring-offset-gray-900`;

  return (
    <button
      type="button"
      className={className ? `${base} ${className}` : defaultClasses}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
