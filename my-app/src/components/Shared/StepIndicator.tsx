import React from "react";


export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  const colorPalette = {
    darkGreen: "#44624a",
    softGreen: "#8ba888",
    oliveGray: "#505143",
    lightGray: "#f1f5f9",
  };
  
  return (
    <div className="mb-4 md:mb-8 w-full max-w-md mx-auto">
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-sm md:text-base ${
                    isActive ? "scale-110" : ""
                  }`}
                  style={{
                    backgroundColor: isDone
                      ? colorPalette.softGreen
                      : isActive
                      ? colorPalette.darkGreen
                      : "#d1d5db",
                    color: isDone || isActive ? "white" : colorPalette.oliveGray
                  }}
                >
                  {isDone ? "✓" : stepNumber}
                </div>
                <p
                  className={`mt-1 md:mt-2 text-xs md:text-sm text-center ${
                    isActive ? "font-bold" : ""
                  }`}
                  style={{
                    color: isActive ? colorPalette.darkGreen : colorPalette.oliveGray
                  }}
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
                <div className="flex items-center">
                  <div
                    className="h-0.5 mx-1 md:mx-2 mb-3 md:mb-5"
                    style={{
                      width: "2rem",
                      backgroundColor: isDone ? colorPalette.softGreen : "#d1d5db"
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
