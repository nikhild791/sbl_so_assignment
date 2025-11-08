"use client"

type SpinnerProps = {
  size?: number;
  className?: string;
  "aria-label"?: string;
};

export const Spinner = ({ size = 24, className, "aria-label": ariaLabel = "Loading" }: SpinnerProps) => {
  const sizeClass = {
    12: "w-3 h-3 border-2",
    16: "w-4 h-4 border-2",
    20: "w-5 h-5 border-2",
    24: "w-6 h-6 border-2",
    32: "w-8 h-8 border-2",
  }[size] || "w-6 h-6 border-2";

  const classes = ["animate-spin", "rounded-full", "border-t-transparent", "border-white", sizeClass, className]
    .filter(Boolean)
    .join(" ");

  return <div role="status" aria-label={ariaLabel} className={classes} />;
};

