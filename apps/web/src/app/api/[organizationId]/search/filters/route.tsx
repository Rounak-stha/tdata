import { NextRequest, NextResponse } from "next/server";
import { ERRORS, HTTP_CODES } from "@lib/constants";
import { APIError, isAPIError } from "@/lib/error/api-error";
import { OrganizationRepository } from "@/repositories";

export async function GET(req: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const organizationId = parseInt((await params).organizationId);

    if (isNaN(organizationId)) {
      throw new APIError("INVALID_REQUEST", "OrganizationId is inavlid");
    }

    // For now the Projects and Members are received from the organization context
    const organizationStatuses = await OrganizationRepository.getStatuses(organizationId);
    const organizationPriorities = await OrganizationRepository.getPriorities(organizationId);
    const organizationTaskTypes = await OrganizationRepository.getTaskTypes(organizationId);

    return NextResponse.json({ data: { status: organizationStatuses, priorities: organizationPriorities, taskTypes: organizationTaskTypes } });
  } catch (e) {
    if (isAPIError(e)) {
      return NextResponse.json({ message: e.message, additionalMessage: e.additionalMessage }, { status: e.httpCode });
    }
    return NextResponse.json({ message: ERRORS.INTERNAL_SERVER_ERROR }, { status: HTTP_CODES.INTERNAL_SERVER_ERROR });
  }
}
