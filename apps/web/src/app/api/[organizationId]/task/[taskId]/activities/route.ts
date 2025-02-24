import { NextRequest, NextResponse } from "next/server";
import { ERRORS, HTTP_CODES } from "@lib/constants";
import { APIError, isAPIError } from "@/lib/error/api-error";
import { TaskRepository } from "@/repositories";

export async function GET(req: NextRequest, { params }: { params: Promise<{ organizationId: string; taskId: string }> }) {
  try {
    const awaitedParams = await params;
    const organizationId = parseInt(awaitedParams.organizationId);
    const taskId = parseInt(awaitedParams.taskId);
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "0");
    const page = parseInt(searchParams.get("page") || "0");

    if (isNaN(organizationId) || isNaN(taskId)) {
      throw new APIError("INVALID_REQUEST", "Inavlid Params");
    }

    const taskActivities = await TaskRepository.getActivities({
      taskId,
      organizationId,
      limit: limit || 10,
      page: page || 1,
    });

    return NextResponse.json({ data: taskActivities });
  } catch (e) {
    console.log(e);
    if (isAPIError(e)) {
      return NextResponse.json({ message: e.message, additionalMessage: e.additionalMessage }, { status: e.httpCode });
    }
    return NextResponse.json({ message: ERRORS.INTERNAL_SERVER_ERROR }, { status: HTTP_CODES.INTERNAL_SERVER_ERROR });
  }
}
