export const SITE_URL = (() => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
})();

export const PathPrefix = {
  api: "/api",
  auth: "/auth",
} as const;

const withSearchParam = (path: string) => {
  return (params?: Record<string, string>) => {
    let fullPath = path;
    if (params) {
      const parsedParams = new URLSearchParams(params);
      fullPath += `?${parsedParams.toString()}`;
    }
    return fullPath;
  };
};

export const InvitePath = "/invite";

export const Paths = {
  root: withSearchParam("/"),
  signin: `${PathPrefix.auth}/signin`,
  onboarding: withSearchParam("/onboarding"),
  error: "/error",
  verifyEmail: withSearchParam("/auth/verify"),
  org: (org: string) => `/${org}`,
  task: (org: string, taskNumber: string) => `/${org}/task/${taskNumber}`,
  projects: (org: string) => `/${org}/projects`,
  project: (orgKey: string, projectKey: string) => `/${orgKey}/projects/${projectKey}`,
  projectAutomations: (orgKey: string, projectKey: string) => `/${orgKey}/projects/${projectKey}/automations`,
  projectAutomationCreate: (orgKey: string, projectKey: string) => `/${orgKey}/projects/${projectKey}/automations/create`,
  projectAutomation: (orgKey: string, projectKey: string, automationId: string) => `/${orgKey}/projects/${projectKey}/automations/${automationId}`,
  newProject: (org: string) => `/${org}/projects/create`,
  myTasks: (org: string) => `/${org}/my-tasks`,
  search: (org: string, params?: string) => (`/${org}/search` + params ? `?${params}` : ""),

  // Documents
  docs: (org: string) => `/${org}/docs`,
  newDoc: (org: string) => `/${org}/docs/new`,
  doc: (org: string, docId: string) => `/${org}/docs/${docId}`,

  // chat
  chat: (org: string) => `/${org}/chat`,

  // invite
  invite: (token: string) => `${SITE_URL}${InvitePath}?token=${token}`,
} as const;

export const ApiPaths = {
  chat: (orgId: number) => `/api/${orgId}/chat`,
};
