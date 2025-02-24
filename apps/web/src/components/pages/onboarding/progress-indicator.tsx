interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="text-sm text-muted-foreground">
        {currentStep} of {totalSteps} steps
      </div>
      <div className="flex-1 h-1 bg-muted rounded-full">
        <div className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
      </div>
    </div>
  );
}
