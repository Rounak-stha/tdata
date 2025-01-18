import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from '../../lib/schema'
import { getPlugins } from '../../lib/plugins'
// import { MenuBar } from './MenuBar'
import { SlashMenu } from './SlashMenu'
import { slashMenuPluginKey } from '../../lib/plugins/slash-menu'
import { getMenuPosition } from '../../lib/plugins/slash-menu/utils'
import { ContentRefValue } from '@tdata/global'
type EditroProps = {
	content?: string
	className?: string
}
// min-h-[300px]
export const Editor = forwardRef<ContentRefValue, EditroProps>(function Editor({ content, className }, ref) {
	const editorRef = useRef<HTMLDivElement>(null)
	const viewRef = useRef<EditorView | null>(null)
	const [slashMenu, setSlashMenu] = useState<{
		open: boolean
		position: { top: number; left: number }
	} | null>(null)

	useImperativeHandle(ref, () => ({
		getContent: () => {
			const json = viewRef?.current?.state.toJSON()
			if (json) {
				return JSON.stringify(json)
			}
			return ''
		}
	}))

	useEffect(() => {
		if (!editorRef.current) return

		const state = EditorState.create({
			doc: content ? schema.nodeFromJSON(JSON.parse(content)) : undefined,
			schema,
			plugins: getPlugins()
		})

		const view = new EditorView(editorRef.current, {
			state,
			dispatchTransaction(transaction) {
				const newState = view.state.apply(transaction)
				view.updateState(newState)

				// Update slash menu state
				const slashState = slashMenuPluginKey.getState(newState)
				if (slashState && slashState.open && slashState.position !== null) {
					const position = getMenuPosition(view, slashState.slashPos as number)

					setSlashMenu({
						open: true,
						position
					})
				} else {
					setSlashMenu(null)
				}
			},
			attributes: {
				class: 'prose prose-lg max-w-none focus:outline-none'
			}
		})

		viewRef.current = view

		return () => {
			if (viewRef.current) {
				viewRef.current.destroy()
			}
		}
	}, [])

	return (
		<div className={`bg-inherit w-full relative ${className}`}>
			{/* {viewRef.current && <MenuBar view={viewRef.current} />} */}
			<div ref={editorRef} />
			{slashMenu?.open && viewRef.current && (
				<SlashMenu view={viewRef.current} position={slashMenu.position} onClose={() => setSlashMenu(null)} />
			)}
		</div>
	)
})
