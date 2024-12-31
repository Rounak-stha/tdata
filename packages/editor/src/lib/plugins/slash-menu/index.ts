import { Plugin, PluginKey } from 'prosemirror-state'
import type { SlashMenuMeta, SlashMenuPluginState } from './types'
import { Commands as InitialCommands } from './commands/slash'

export const slashMenuPluginKey = new PluginKey<SlashMenuPluginState>('slashMenu')

export const slashMenuPlugin = () => {
	return new Plugin({
		key: slashMenuPluginKey,
		state: {
			init() {
				return {
					open: false,
					filter: '',
					commands: InitialCommands,
					shouldExecute: false,
					selectedIndex: 0,
					position: null,
					slashPos: null
				} as SlashMenuPluginState
			},
			apply(tr, state) {
				// Always update if selection changes
				if (tr.selectionSet) {
					const { $from } = tr.selection
					const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)

					// Check for a slash preceded by a space or at the start of a block
					const slashMatch = textBefore.match(/(?:^|\s)\/([^\s]*)$/)
					const hasDoubleSlash = textBefore.endsWith('//')

					if (slashMatch && !hasDoubleSlash) {
						const filter = (slashMatch[1] || '').toLowerCase()
						const slashPos = $from.pos - 1 - filter.length
						return {
							open: true,
							filter,
							selectedIndex: 0,
							shouldExecute: false,
							commands: filter
								? InitialCommands.filter((command) => command.title.toLowerCase().includes(filter))
								: InitialCommands,
							position: $from.pos,
							slashPos
						}
					}
				}

				// Close menu if document changes (e.g., when executing a command)
				if (tr.docChanged) {
					return {
						open: false,
						filter: '',
						selectedIndex: 0,
						shouldExecute: false,
						commands: InitialCommands,
						position: null,
						slashPos: null
					}
				}

				const meta: SlashMenuMeta | undefined = tr.getMeta(slashMenuPluginKey)
				const { selectedIndex, commands } = state
				const numberOfCommandItems = commands.length

				if (meta?.type == 'execute') {
					return {
						...state,
						shouldExecute: true
					}
				}

				if (meta?.type == 'NextItem') {
					return {
						...state,
						selectedIndex: Math.min(selectedIndex + 1, numberOfCommandItems - 1)
					}
				}
				if (meta?.type == 'PrevItem') {
					return {
						...state,
						selectedIndex: Math.max(selectedIndex - 1, 0)
					}
				}
				return state
			}
		},
		props: {
			handleKeyDown(view, event) {
				const pluginState = this.getState(view.state)
				if (!pluginState?.open) return false

				// Handle escape key
				if (event.key === 'Escape') {
					view.dispatch(view.state.tr.insertText(''))
					return true
				}

				// Close menu on space
				if (event.key === ' ') {
					view.dispatch(view.state.tr)
					return false
				}

				if (event.key === 'Enter') {
					view.dispatch(view.state.tr.setMeta(slashMenuPluginKey, { type: 'execute' } as SlashMenuMeta))
					return true
				}

				if (event.key == 'ArrowDown') {
					view.dispatch(view.state.tr.setMeta(slashMenuPluginKey, { type: 'NextItem' } as SlashMenuMeta))
					return true
				}

				if (event.key == 'ArrowUp') {
					view.dispatch(view.state.tr.setMeta(slashMenuPluginKey, { type: 'PrevItem' } as SlashMenuMeta))
					return true
				}

				return false
			}
		}
	})
}
