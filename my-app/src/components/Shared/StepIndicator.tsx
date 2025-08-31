import React from "react";


export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="mb-8 w-full max-w-md mx-auto">
    <div className="flex items-center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                  ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isActive
                      ? "bg-emerald-800 text-white scale-110"
                      : "bg-slate-300 text-slate-600"
                  }`}
              >
                {isDone ? "✓" : stepNumber}
              </div>
              <p
                className={`mt-2 text-xs text-center ${
                  isActive ? "font-bold text-emerald-800" : "text-slate-500"
                }`}
              >
                {stepNumber === 1
                  ? "Básicos"
                  : stepNumber === 2
                  ? "Detalles"
                  : stepNumber === 3
                  ? "Miembros"
                  : "Vista previa"}
              </p>
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  isDone ? "bg-emerald-600" : "bg-slate-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);
