import { useEffect, useRef, useState } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from '../../lib/schema'
import { getPlugins } from '../../lib/plugins'
import { MenuBar } from './MenuBar'
import { Placeholder } from './Placeholder'
import { SlashMenu } from './SlashMenu'
import { slashMenuPluginKey } from '../../lib/plugins/slash-menu'

export function Editor() {
	const editorRef = useRef<HTMLDivElement>(null)
	const viewRef = useRef<EditorView | null>(null)
	const [slashMenu, setSlashMenu] = useState<{
		open: boolean
		position: { top: number; left: number }
	} | null>(null)

	useEffect(() => {
		if (!editorRef.current) return

		const state = EditorState.create({
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
				if (slashState?.open && slashState.position !== null) {
					const coords = view.coordsAtPos(slashState.position)
					const domRect = view.dom.getBoundingClientRect()

					setSlashMenu({
						open: true,
						position: {
							top: coords.top - domRect.top + 52,
							left: coords.left - domRect.left
						}
					})
				} else {
					setSlashMenu(null)
				}
			},
			attributes: {
				class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px]'
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
		<div className='w-full'>
			<div className='bg-inherit rounded-lg shadow-sm border border-border-200 relative'>
				{viewRef.current && <MenuBar view={viewRef.current} />}
				<div ref={editorRef} className='p-6' />
				{viewRef.current && <Placeholder editorView={viewRef.current} />}
				{slashMenu?.open && viewRef.current && (
					<SlashMenu
						view={viewRef.current}
						position={slashMenu.position}
						onClose={() => setSlashMenu(null)}
					/>
				)}
			</div>
		</div>
	)
}
