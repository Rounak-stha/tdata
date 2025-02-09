export const PathPrefix = {
  api: "/api",
  auth: "/auth",
} as const;

export const Paths = {
  root: "/",
  signin: `${PathPrefix.auth}/signin`,
  onboarding: "/onboarding",
  error: "/error",
  org: (org: string) => `/${org}`,
  task: (org: string, taskNumber: string) => `/${org}/${taskNumber}`,
} as const;
