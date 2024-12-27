import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

export type CommandFunction = (state: EditorState, dispatch?: EditorView['dispatch']) => boolean

export type SlashMenuPluginState = {
	open: boolean
	numberOfCommandItems: number
	shouldExecute: boolean
	selectedIndex: number
	position: number | null
	slashPos: number | null
}

type SlashMetaTypes = 'NextItem' | 'PrevItem' | 'execute'

export type SlashMenuMeta = {
	type: SlashMetaTypes
}

export interface Command {
	title: string
	icon: React.ElementType
	execute: (state: EditorState, dispatch?: EditorView['dispatch']) => boolean
}
