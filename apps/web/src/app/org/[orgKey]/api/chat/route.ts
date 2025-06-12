import { getSession } from "@/lib/actions/auth";
import { tools } from "@/lib/ai/tools";
import { ERRORS, HTTP_CODES } from "@/lib/constants";
import { APIError, isAPIError } from "@/lib/error/api-error";
import { OrganizationRepository } from "@/repositories";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request, { params }: { params: Promise<{ orgKey: string }> }) {
  try {
    const { data, success } = await getSession();
    if (!success) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { user } = data;
    const orgKey = (await params).orgKey;
    const organization = await OrganizationRepository.getByKey(orgKey);

    if (!organization) throw new APIError("INVALID_REQUEST", "No Access on Organization");
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-2.0-flash"),
      messages,
      system: `Your name is Mira, an AI assistant for a project management application. 
	  You help users with their tasks, projects, and provide guidance on project management best practices. 
	  Be concise, helpful, and professional. Provide specific, actionable advice when possible. 
	  You can create tasks, update task status, fetch project information, and generate project timelines when requested.

	  For the current call, the organizationId is ${organization.id} and userId is ${user.id}.
	  `,
      temperature: 0.7,
      tools,
      maxSteps: 3,
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.log(e);
    if (isAPIError(e)) {
      return NextResponse.json({ message: e.message, additionalMessage: e.additionalMessage }, { status: e.httpCode });
    }
    return NextResponse.json({ message: ERRORS.INTERNAL_SERVER_ERROR }, { status: HTTP_CODES.INTERNAL_SERVER_ERROR });
  }
}
