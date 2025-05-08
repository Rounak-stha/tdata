import { getSession } from "@/lib/actions/auth";
import { tools } from "@/lib/ai/tools";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request, { params }: { params: Promise<{ organizationId: string }> }) {
  const { data, success } = await getSession();
  if (!success) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { user } = data;
  const organizationId = parseInt((await params).organizationId);
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    system: `Your name is Mira, an AI assistant for a project management application. 
	  You help users with their tasks, projects, and provide guidance on project management best practices. 
	  Be concise, helpful, and professional. Provide specific, actionable advice when possible. 
	  You can create tasks, update task status, fetch project information, and generate project timelines when requested.

	  For the current call, the organizationId is ${organizationId} and userId is ${user.id}.
	  `,
    temperature: 0.7,
    tools,
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
