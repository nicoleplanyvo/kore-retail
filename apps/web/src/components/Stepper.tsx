import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Fortschritt" className="mb-xl">
      <ol className="flex items-center gap-0">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <li key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-sm">
                {/* Step circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                    transition-colors duration-200
                    ${isCompleted ? 'bg-kore-brass text-white' : ''}
                    ${isCurrent ? 'bg-kore-brass text-white ring-2 ring-kore-brass/30 ring-offset-2' : ''}
                    ${isFuture ? 'bg-kore-border text-kore-mid' : ''}
                  `}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
                </div>
                {/* Label */}
                <span
                  className={`
                    font-body text-xs uppercase tracking-wider hidden sm:block whitespace-nowrap
                    ${isCompleted ? 'text-kore-brass font-medium' : ''}
                    ${isCurrent ? 'text-kore-ink font-medium' : ''}
                    ${isFuture ? 'text-kore-mid' : ''}
                  `}
                >
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-px mx-md min-w-[16px]
                    ${index < currentStep ? 'bg-kore-brass' : 'bg-kore-border'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
