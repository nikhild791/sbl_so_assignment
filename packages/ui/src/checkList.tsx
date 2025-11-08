import { FC } from "react";
import { Check, Loader2 } from "lucide-react";

export interface Step {
  state: string;
  progress: number;
}

interface StatusProgressProps {
  title: string;
  steps: Step[];
}

const labelFor = (p: number) => {
  if (p === 10) return "Queued";
  if (p === 50) return "Scraped";
  if (p === 70) return "AI";
  if (p === 100) return "Completed";
  return "Processing";
};

export const StatusProgress: FC<StatusProgressProps> = ({ title, steps }) => {
  return (
    <div className="w-full max-w-lg border rounded-xl shadow-sm p-4 bg-white">
      <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">{title}</h2>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isDone = step.state === "completed";
          const isRunning = step.state === "running";
          const label = labelFor(step.progress);

          return (
            <div
              key={index}
              className="flex items-center gap-3 md:gap-4 bg-gray-50 rounded-lg p-3 md:p-3"
            >
              <div className="flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isDone ? "bg-green-500 text-white" : isRunning ? "bg-white ring-2 ring-blue-200 text-blue-500" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isDone ? <Check size={16} /> : isRunning ? <Loader2 size={16} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-gray-500" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 truncate">{label}</div>
                  <div className="text-xs text-gray-500">{step.progress}%</div>
                </div>
                <div className="mt-1">
                  <div className="w-full bg-gray-100 h-2 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${step.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
