import { Plugin, PluginKey } from 'prosemirror-state'
import type { SlashMenuMeta, SlashMenuPluginState } from './types'
import { Number_Of_Command_Items } from './commands/slash'

export const slashMenuPluginKey = new PluginKey<SlashMenuPluginState>('slashMenu')

export const slashMenuPlugin = () => {
	return new Plugin({
		key: slashMenuPluginKey,
		state: {
			init() {
				return {
					open: false,
					numberOfCommandItems: Number_Of_Command_Items,
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
					const hasValidSlash = textBefore.match(/(?:^|\s)\/$/)
					const hasDoubleSlash = textBefore.endsWith('//')

					if (hasValidSlash && !hasDoubleSlash) {
						const slashPos = $from.pos - 1
						return {
							open: true,
							selectedIndex: state.selectedIndex,
							shouldExecute: false,
							numberOfCommandItems: state.numberOfCommandItems,
							position: $from.pos,
							slashPos
						}
					}
				}

				// Close menu if document changes (e.g., when executing a command)
				if (tr.docChanged) {
					return {
						open: false,
						selectedIndex: 0,
						shouldExecute: false,
						numberOfCommandItems: state.numberOfCommandItems,
						position: null,
						slashPos: null
					}
				}

				const meta: SlashMenuMeta | undefined = tr.getMeta(slashMenuPluginKey)
				const { selectedIndex } = state

				if (meta?.type == 'execute') {
					return {
						...state,
						shouldExecute: true
					}
				}

				if (meta?.type == 'NextItem') {
					return {
						...state,
						selectedIndex: Math.min(selectedIndex + 1, state.numberOfCommandItems - 1)
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
