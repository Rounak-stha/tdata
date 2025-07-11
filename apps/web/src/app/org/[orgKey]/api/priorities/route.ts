import { NextRequest, NextResponse } from "next/server";
import { ERRORS, HTTP_CODES } from "@lib/constants";
import { APIError, isAPIError } from "@/lib/error/api-error";
import { OrganizationRepository } from "@/repositories";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orgKey: string }> }) {
  try {
    const orgKey = (await params).orgKey;
    const organization = await OrganizationRepository.getByKey(orgKey);

    if (!organization) throw new APIError("INVALID_REQUEST", "No Access on Organization");

    const organizationPriorities = await OrganizationRepository.getPriorities(organization.id);

    return NextResponse.json({ data: organizationPriorities });
  } catch (e) {
    console.log(e);
    if (isAPIError(e)) {
      return NextResponse.json({ message: e.message, additionalMessage: e.additionalMessage }, { status: e.httpCode });
    }
    return NextResponse.json({ message: ERRORS.INTERNAL_SERVER_ERROR }, { status: HTTP_CODES.INTERNAL_SERVER_ERROR });
  }
}
