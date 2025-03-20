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

    const organizationTaskTypes = await OrganizationRepository.getTaskTypes(organizationId);

    return NextResponse.json({ data: organizationTaskTypes });
  } catch (e) {
    if (isAPIError(e)) {
      return NextResponse.json({ message: e.message, additionalMessage: e.additionalMessage }, { status: e.httpCode });
    }
    return NextResponse.json({ message: ERRORS.INTERNAL_SERVER_ERROR }, { status: HTTP_CODES.INTERNAL_SERVER_ERROR });
  }
}
