import { ERROR_TO_HTTP_CODE, ERROR_CODES, type ErrorName, ERRORS } from '@lib/constants'

export class APIError extends Error {
	code: number
	httpCode: number
	additionalMessage: string = ''

	constructor(name: ErrorName, additionalMessage?: string) {
		super(ERRORS[name])
		this.name = name
		this.code = ERROR_CODES[name]
		this.httpCode = ERROR_TO_HTTP_CODE[name]

		if (additionalMessage) {
			this.additionalMessage = additionalMessage
		}
	}
}

export function isAPIError(error: unknown): error is APIError {
	if (error instanceof APIError) {
		return true
	} else {
		return false
	}
}
