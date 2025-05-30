"use client";

import { FC, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { onboardUser } from "@/lib/actions/auth";
import { Paths } from "@/lib/constants";

import { OnboardingData, OnboardingUserContext } from "@types";
import { InfantUser, InvitationDetail } from "@tdata/shared/types";

import { PersonalInfoStep } from "./personal-info-step";
import { OrganizationStep } from "./organization-step";
import { ProgressIndicator } from "./progress-indicator";

type OnboardingFlowProps = { user: InfantUser; invitation: InvitationDetail | null };

export const OnboardingFlow: FC<OnboardingFlowProps> = ({ user, invitation }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const router = useRouter();
  const totalSteps = useMemo(() => {
    if (!invitation) return 2;
    return 1;
  }, [invitation]);

  const handlePersonalInfoNext = (personalInfo: { name: string; email: string; avatar?: string }, setLoading: (val: boolean) => void) => {
    const updatedData = { ...data, ...personalInfo };
    setData(updatedData);
    if (invitation !== null) {
      updatedData.organization = { name: invitation.organization.name, key: invitation.organization.key };
      handleOnboardUser(updatedData as OnboardingData, setLoading);
    } else {
      setStep(2);
    }
  };

  const handleOnboardUser = async (data: OnboardingData, setLoading: (val: boolean) => void) => {
    try {
      setLoading(true);
      const userContext: OnboardingUserContext = { type: invitation ? "Invited" : "New_User" };
      const { success } = await onboardUser(data, userContext);
      if (success) {
        router.push(Paths.root());
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to onboard user");
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationNext = async (organization: OnboardingData["organization"], setLoading: (val: boolean) => void) => {
    const updatedData = { ...data, organization };
    setData(updatedData);
    handleOnboardUser(updatedData as OnboardingData, setLoading);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {totalSteps > 1 ? <ProgressIndicator currentStep={step} totalSteps={totalSteps} /> : null}

        <div className="bg-card rounded-lg p-8">
          {step === 1 && <PersonalInfoStep user={user} onNext={handlePersonalInfoNext} />}
          {step === 2 && <OrganizationStep onNext={handleOrganizationNext} onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
};
