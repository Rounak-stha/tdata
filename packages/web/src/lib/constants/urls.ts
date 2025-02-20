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
  projects: (org: string) => `/${org}/projects`,
  newProject: (org: string) => `/${org}/project/create`,
  myTasks: (org: string) => `/${org}/my-tasks`,
} as const;
