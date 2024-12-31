import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { tableEditing } from 'prosemirror-tables'
import { buildKeymap } from './keymap'
import { buildInputRules } from './inputrules'
import { schema } from './schema'
import { codeBlockHighlightPlugin } from './syntax-highlight'
import { slashMenuPlugin } from './plugins/slash-menu'
import { placeholder } from './plugins/placeholder'

export const getPlugins = () => [
	placeholder('Type / for commands'),
	buildInputRules(schema),
	keymap(buildKeymap(schema)),
	slashMenuPlugin(), // Slash Menu Plugin should come before baseKeymap as the baseKeyMap consumes the enter key
	keymap(baseKeymap),
	dropCursor(),
	gapCursor(),
	history(),
	tableEditing(),
	codeBlockHighlightPlugin()
]
