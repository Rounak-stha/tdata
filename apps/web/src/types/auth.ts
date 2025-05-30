export type OnboardingData = {
  name: string;
  email: string;
  avatar?: string;
  organization: {
    name: string;
    key: string;
  };
};

export type OnboardingUserContext = {
  type: "Invited" | "New_User";
};
