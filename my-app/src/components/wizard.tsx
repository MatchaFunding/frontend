import { useState } from "react";

const steps = [
  "The Basics",
  "Choose your Plan(s)",
  "Lifestyle Q&A",
  "Review & Edit Policy",
  "Purchase"
];

export default function WizardStepper() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full p-4">

      <div className="flex justify-between items-center mb-4 relative">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <p
              className={`text-sm font-medium transition-colors duration-300 ${
                index === currentStep
                  ? "text-blue-700 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded"></div>
        <div
          className="absolute bottom-0 left-0 h-1 bg-blue-700 rounded transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
