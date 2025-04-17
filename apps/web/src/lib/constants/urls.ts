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
  projectAutomationCreate: (orgKey: string, projectKey: string) => `/${orgKey}/projects/${projectKey}/automations/create`,
  projectAutomation: (orgKey: string, projectKey: string, automationId: string) => `/${orgKey}/projects/${projectKey}/automations/${automationId}`,
  newProject: (org: string) => `/${org}/projects/create`,
  myTasks: (org: string) => `/${org}/my-tasks`,
  search: (org: string) => `/${org}/search`,
} as const;

export const ApiPaths = {
  chat: (orgId: number) => `/api/${orgId}/chat`,
};
