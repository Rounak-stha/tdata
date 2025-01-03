import { EditorView } from 'prosemirror-view'
import { commands } from '../../lib/plugins/slash-menu/commands/slash'
import { Command, SlashMenuPluginState } from '../../lib/plugins/slash-menu/types'
import { slashMenuPluginKey } from '../../lib/plugins/slash-menu'
import { useCallback, useEffect } from 'react'

interface SlashMenuProps {
	view: EditorView
	position: { top: number; left: number }
	onClose: () => void
}

export function SlashMenu({ view, position, onClose }: SlashMenuProps) {
	const slashMenuState: SlashMenuPluginState | undefined = slashMenuPluginKey.getState(view.state)
	const selectedIndex = slashMenuState?.selectedIndex ?? 0
	const shouldExecute = slashMenuState?.shouldExecute ?? false

	const handleCommand = useCallback(
		(command: Command) => {
			command.execute(view.state, view.dispatch)
			view.focus()
			onClose()
		},
		[view, onClose]
	)

	useEffect(() => {
		if (shouldExecute) {
			const command = commands[selectedIndex]
			handleCommand(command)
		}
	}, [shouldExecute, handleCommand, selectedIndex])

	return (
		<div
			className='absolute z-50 bg-inherit rounded-lg shadow-xl border border-gray-200 w-56 max-h-80 overflow-y-auto'
			style={{ top: position.top + 60, left: position.left + 10 }}
		>
			<div className='p-1'>
				{commands.map((command, index) => {
					const Icon = command.icon
					return (
						<button
							key={index}
							className={`w-full text-left px-2 py-1.5 hover:bg-muted hover:text-muted-foreground text-gray-700 rounded-md flex items-center gap-2 group text-sm ${
								selectedIndex === index ? 'bg-muted bg-muted text-muted-foreground' : ''
							}`}
							onClick={() => handleCommand(command)}
						>
							<Icon className='w-4 h-4' />
							<span>{command.title}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
