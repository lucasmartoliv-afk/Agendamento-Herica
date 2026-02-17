
import React from 'react';

type Step = 'SERVICE' | 'DATETIME' | 'CONFIRMATION' | 'SUCCESS';

interface ProgressTrackerProps {
  currentStep: Step;
}

const steps: { id: Step; title: string }[] = [
  { id: 'SERVICE', title: 'Serviço' },
  { id: 'DATETIME', title: 'Data e Hora' },
  { id: 'CONFIRMATION', title: 'Confirmação' },
];

const getStepIndex = (step: Step) => {
    switch(step) {
        case 'SERVICE': return 0;
        case 'DATETIME': return 1;
        case 'CONFIRMATION': return 2;
        case 'SUCCESS': return 3;
        default: return 0;
    }
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200" style={{ transform: 'translateY(-50%)' }}></div>
        <div 
            className="absolute top-1/2 left-0 h-0.5 bg-pink-500 transition-all duration-500 ease-out" 
            style={{ 
                width: `${(currentIndex / (steps.length - 1)) * 100}%`,
                transform: 'translateY(-50%)'
            }}>
        </div>
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="z-10 text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 mx-auto
                  ${currentIndex >= index ? 'bg-pink-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}
                `}
              >
                {currentIndex > index ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p className={`mt-2 text-xs font-medium transition-colors duration-500 ${
                  currentIndex >= index ? 'text-pink-600' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
