export type ContentRefValue = {
	getContent: () => string
}

export type FormItemContentRefValue<T> = {
	getContent: () => T
	showError: () => void
}
