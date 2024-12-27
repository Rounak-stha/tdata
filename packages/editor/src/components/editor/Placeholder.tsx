import { EditorView } from 'prosemirror-view';

interface PlaceholderProps {
  editorView: EditorView | null;
}

export function Placeholder({ editorView }: PlaceholderProps) {
  if (!editorView || editorView.state.doc.textContent) {
    return null;
  }

  return (
    <div className="absolute top-[120px] left-8 text-gray-400 pointer-events-none">
      Type '/' for commands...
    </div>
  );
}
