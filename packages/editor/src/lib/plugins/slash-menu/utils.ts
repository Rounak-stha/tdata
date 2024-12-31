import { EditorView } from 'prosemirror-view'

const HeadingHeight = 52

export const getMenuPosition = (view: EditorView, slashPos: number) => {
	const coords = view.coordsAtPos(slashPos)
	const domRect = view.dom.getBoundingClientRect()

	const { $from } = view.state.selection // Get the resolved position
	const node = $from.node()
	const nodeType = node.type.name // Get the type of the node

	const position = {
		top: coords.top - domRect.top + HeadingHeight,
		left: coords.left - domRect.left
	}

	if (nodeType == 'heading') {
		const level = node.attrs.level || 1
		if (level === 1) position.top += 32
		else if (level === 2) position.top += 24
	}
	return position
}
