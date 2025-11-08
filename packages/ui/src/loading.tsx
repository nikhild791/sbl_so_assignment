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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-black/5 w-12 h-12 flex items-center justify-center">
                <Spinner size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">Tracking progress of background job</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">{percent}%</div>
          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <StatusProgress title="Pipeline" steps={steps} />

          <div className="mt-4 text-right text-sm text-gray-500">This will update automatically as each step completes.</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
