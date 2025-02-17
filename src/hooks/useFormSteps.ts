
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";

export function useFormSteps(
  formData: PropertyFormData,
  autosaveData: () => Promise<void>,
  totalSteps: number
) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      try {
        await autosaveData();
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to save progress",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId > currentStep) {
      try {
        await autosaveData();
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to save progress",
        });
        return;
      }
    }
    setCurrentStep(stepId);
  };

  return {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick
  };
}
