export const ERRORS = {
	// API
	INSUFFICIENT_DATA: 'Insufficient Data',
	INVALID_DATA: 'Invalid Data',
	INVALID_REQUEST: 'Invalid Request',
	METHOD_NOT_ALLOWED: 'Method Not Allowed',
	INTERNAL_SERVER_ERROR: 'Internal Server Error',

	// User
	UNAUTHORIZED: 'User is not authorized to perform this action',
	NON_ONBORDED_USER: 'User not Onborded',
	USER_NOT_FOUND: 'User not found',
	ORGANIZATION_NOT_FOUND: 'Organization not found',

	// Webhook
	UNSUPPORTED_EVENT: 'Unsupported Event',

	// Unknown
	UNKNOWN_ERROR: 'Unknown Error',

	// Dev error
	// These errors are not meant to be shown to the user
	ENV_NOT_SET: 'Environment variable not set'
}

export type ErrorName = keyof typeof ERRORS

export const ERROR_CODES: Record<ErrorName, number> = {
	// API
	INSUFFICIENT_DATA: 2001,
	INVALID_DATA: 2002,
	INVALID_REQUEST: 2003,
	METHOD_NOT_ALLOWED: 2004,
	INTERNAL_SERVER_ERROR: 2005,

	// User related error
	UNAUTHORIZED: 3001,
	NON_ONBORDED_USER: 3002,
	USER_NOT_FOUND: 3003,
	ORGANIZATION_NOT_FOUND: 3003,

	// Webhook
	UNSUPPORTED_EVENT: 4001,

	// Unknown
	UNKNOWN_ERROR: 5001,

	// Dev Error
	ENV_NOT_SET: 6000
}

export const HTTP_CODES = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,

	INTERNAL_SERVER_ERROR: 500
}

export const ERROR_TO_HTTP_CODE: Record<ErrorName, number> = {
	// API
	INSUFFICIENT_DATA: HTTP_CODES.BAD_REQUEST,
	INVALID_DATA: HTTP_CODES.BAD_REQUEST,
	INVALID_REQUEST: HTTP_CODES.BAD_REQUEST,
	METHOD_NOT_ALLOWED: HTTP_CODES.METHOD_NOT_ALLOWED,
	INTERNAL_SERVER_ERROR: HTTP_CODES.INTERNAL_SERVER_ERROR,

	// User related error
	UNAUTHORIZED: HTTP_CODES.UNAUTHORIZED,
	NON_ONBORDED_USER: HTTP_CODES.UNAUTHORIZED,
	USER_NOT_FOUND: HTTP_CODES.BAD_REQUEST,
	ORGANIZATION_NOT_FOUND: HTTP_CODES.NOT_FOUND,

	// Webhook
	UNSUPPORTED_EVENT: HTTP_CODES.BAD_REQUEST,

	// Unknown
	UNKNOWN_ERROR: HTTP_CODES.INTERNAL_SERVER_ERROR,

	//Dev Error
	ENV_NOT_SET: HTTP_CODES.INTERNAL_SERVER_ERROR
}
