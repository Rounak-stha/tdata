import { Plugin, PluginKey } from 'prosemirror-state'
import { Node } from 'prosemirror-model'
import { DecorationSet, Decoration } from 'prosemirror-view'
import Prism from 'prismjs'

// Import basic languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'

const LANGUAGES = {
	js: 'javascript',
	javascript: 'javascript',
	jsx: 'jsx',
	ts: 'typescript',
	typescript: 'typescript',
	tsx: 'tsx',
	css: 'css',
	py: 'python',
	python: 'python'
}

function getLanguage(node: Node): string {
	const lang = node.attrs.params as keyof typeof LANGUAGES
	return LANGUAGES[lang] || 'javascript'
}

function highlightCode(code: string, language: string): string {
	if (!Prism.languages[language]) {
		return code
	}
	return Prism.highlight(code, Prism.languages[language], language)
}

export function codeBlockHighlightPlugin() {
	return new Plugin({
		key: new PluginKey('codeBlockHighlight'),
		state: {
			init() {
				return DecorationSet.empty
			},
			apply(tr, set) {
				return set.map(tr.mapping, tr.doc)
			}
		},
		props: {
			decorations(state) {
				const decorations: Decoration[] = []
				const doc = state.doc

				doc.descendants((node, pos) => {
					if (node.type.name === 'code_block') {
						const language = getLanguage(node)
						const highlighted = highlightCode(node.textContent, language)

						if (highlighted !== node.textContent) {
							const widget = document.createElement('div')
							widget.className = `syntax-highlighted language-${language}`
							widget.innerHTML = highlighted

							decorations.push(Decoration.widget(pos + 1, widget))
						}
					}
				})

				return DecorationSet.create(doc, decorations)
			}
		}
	})
}
