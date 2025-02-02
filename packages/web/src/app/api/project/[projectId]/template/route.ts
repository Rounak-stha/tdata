import { NextRequest, NextResponse } from 'next/server'
import { ERRORS, HTTP_CODES } from '@lib/constants'
import { APIError, isAPIError } from '@/lib/error/api-error'
import { ProjectRepository } from '@/repositories'

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
	try {
		console.log('=================In Get Project Template Route===========================')
		const projectId = parseInt((await params).projectId)

		if (isNaN(projectId)) {
			throw new APIError('INVALID_REQUEST', 'ProjectId is inavlid')
		}

		const projectTemplate = await ProjectRepository.getProjectTemplate(projectId)

		return NextResponse.json({ data: projectTemplate })
	} catch (e) {
		if (isAPIError(e)) {
			return NextResponse.json(
				{ message: e.message, additionalMessage: e.additionalMessage },
				{ status: e.httpCode }
			)
		}
		return NextResponse.json(
			{ message: ERRORS.INTERNAL_SERVER_ERROR },
			{ status: HTTP_CODES.INTERNAL_SERVER_ERROR }
		)
	}
}
