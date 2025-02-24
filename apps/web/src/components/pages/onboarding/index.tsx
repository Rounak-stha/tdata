"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { onboardUser } from "@/lib/actions/auth";
import { Paths } from "@/lib/constants";

import { OnboardingData } from "@types";
import { InfantUser } from "@tdata/shared/types";

import { PersonalInfoStep } from "./personal-info-step";
import { OrganizationStep } from "./organization-step";
import { ProgressIndicator } from "./progress-indicator";

type OnboardingFlowProps = { user: InfantUser };

export const OnboardingFlow: FC<OnboardingFlowProps> = ({ user }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const router = useRouter();
  const totalSteps = 2;

  const handlePersonalInfoNext = (personalInfo: { name: string; email: string; avatar?: string }) => {
    setData({ ...data, ...personalInfo });
    setStep(2);
  };

  const handleOrganizationNext = async (
    orgInfo: {
      organizationName: string;
      teamSize: string;
      organizationKey: string;
    },
    setLoading: (val: boolean) => void
  ) => {
    try {
      setLoading(true);
      const updatedData = { ...data, ...orgInfo };
      setData(updatedData);
      const { success } = await onboardUser(updatedData as OnboardingData);
      if (success) {
        router.push(Paths.root);
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to onboard user");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

        <div className="bg-card rounded-lg p-8">
          {step === 1 && <PersonalInfoStep user={user} onNext={handlePersonalInfoNext} />}
          {step === 2 && <OrganizationStep onNext={handleOrganizationNext} onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
};
