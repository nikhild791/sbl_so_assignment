import { FC } from "react";
import { Check, Loader2 } from "lucide-react";

export type StepStatus = "waiting" | "running" | "success";

export interface Step {
  title: string;
  status: StepStatus;
  messages?: string[];
}

interface StatusProgressProps {
  title: string;
  steps: Step[];
}

export const StatusProgress: FC<StatusProgressProps> = ({ title, steps }) => {
  return (
    <div className="w-full max-w-lg border rounded-lg shadow-sm p-4 bg-white">
      <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
        {title}
      </h2>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            {/* ICON */}
            <div className="flex flex-col items-center">
              {step.status === "success" && (
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}

              {step.status === "running" && (
                <Loader2 size={20} className="text-blue-500 animate-spin" />
              )}

              {step.status === "waiting" && (
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              )}

              {/* Vertical Connector Line */}
              {index < steps.length - 1 && (
                <div className="w-px h-8 bg-gray-300 mt-1"></div>
              )}
            </div>

            {/* TEXT */}
            <div>
              <p className="font-medium text-gray-800">{step.title}</p>
              {step.messages && step.messages.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {step.messages.map((msg, i) => (
                    <li key={i} className="text-xs text-gray-500">
                      • {msg}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
