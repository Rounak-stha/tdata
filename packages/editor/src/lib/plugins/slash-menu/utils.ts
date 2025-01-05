import { EditorView } from 'prosemirror-view'

// const HeadingHeight = 52

const TopOffsets = {
	heading1: 50,
	heading2: 44,
	normal: 28
}

export const getMenuPosition = (view: EditorView, slashPos: number) => {
	const coords = view.coordsAtPos(slashPos)
	const domRect = view.dom.getBoundingClientRect()

	const { $from } = view.state.selection // Get the resolved position
	const node = $from.node()
	const nodeType = node.type.name // Get the type of the node

	const position = {
		top: coords.top - domRect.top,
		left: coords.left - domRect.left - 2
	}

	if (nodeType == 'heading') {
		const level = node.attrs.level || 1
		if (level === 1) position.top += TopOffsets.heading1
		else if (level === 2) position.top += TopOffsets.heading2
	} else {
		position.top += TopOffsets.normal
	}
	return position
}
