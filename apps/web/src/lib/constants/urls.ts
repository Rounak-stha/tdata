export const SITE_URL = (() => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localtest.com:3000";
})();

export const PathPrefix = {
  api: "/api",
  auth: "/auth",
  org: "/org",
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

export const TenantUrl = (orgKey: string) => `${orgKey}.${new URL(SITE_URL).hostname}`;
export const ApexDomain = `.${new URL(SITE_URL).hostname}`;

export const Paths = {
  root: withSearchParam("/"),
  signin: `${PathPrefix.auth}/signin`,
  onboarding: withSearchParam("/onboarding"),
  error: "/error",
  verifyEmail: withSearchParam("/auth/verify"),
  org: () => "/org",
  task: (taskNumber: string) => `/task/${taskNumber}`,
  projects: () => "/projects",
  project: (projectKey: string) => `/projects/${projectKey}`,
  projectAutomations: (projectKey: string) => `/projects/${projectKey}/automations`,
  projectAutomationCreate: (projectKey: string) => `/projects/${projectKey}/automations/create`,
  projectAutomation: (projectKey: string, automationId: string) => `/projects/${projectKey}/automations/${automationId}`,
  newProject: () => "/projects/create",
  myTasks: () => "/my-tasks",
  search: (params?: string) => "/search" + (params ? `?${params}` : ""),

  // Documents
  docs: () => "/docs",
  newDoc: () => `/docs/new`,
  doc: (docId: string) => `/docs/${docId}`,

  // chat
  chat: () => "/chat",

  // invite
  invite: (token: string) => `${SITE_URL}${InvitePath}?token=${token}`,
} as const;

export const ApiPaths = {
  chat: () => `/api/chat`,
};
