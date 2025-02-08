import { EditorView } from 'prosemirror-view'

export type EditorRenderActionProps = {
	view: EditorView | null
	resetEditor: () => void
}

export type EditorProps = {
	content?: string
	className?: string
	renderActions?: (props: EditorRenderActionProps) => React.ReactNode
}
