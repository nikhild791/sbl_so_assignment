"use client"
import { FC } from "react";
import { StatusProgress, Step } from "./checkList";
import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  visible: boolean;
  title?: string;
  steps: Step[];
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({ visible, title = "Processing", steps }) => {
  if (!visible) return null;

  const last = steps.length ? steps[steps.length - 1] : { progress: 0 };
  const percent = Math.min(100, Math.max(0, last.progress || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-5 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-50 dark:bg-gray-800 w-12 h-12 flex items-center justify-center">
                <Spinner size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tracking progress of background job</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{percent}%</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-auto">
            <StatusProgress title="Pipeline" steps={steps} />
          </div>

          <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">This will update automatically as each step completes.</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
