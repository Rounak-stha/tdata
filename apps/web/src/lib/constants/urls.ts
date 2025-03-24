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
  task: (org: string, taskNumber: string) => `/${org}/task/${taskNumber}`,
  projects: (org: string) => `/${org}/projects`,
  project: (orgKey: string, projectKey: string) => `/${orgKey}/projects/${projectKey}`,
  projectAutomation: (orgKey: string, projectKey: string) => `/${orgKey}/projects/${projectKey}/automations/create`,
  newProject: (org: string) => `/${org}/projects/create`,
  projectAutomation: (org: string, projectKey: string) => `/${org}/projects/${projectKey}/automate`,
  myTasks: (org: string) => `/${org}/my-tasks`,
  search: (org: string) => `/${org}/search`,
} as const;
