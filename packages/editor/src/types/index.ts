import { EditorView } from "prosemirror-view";

export type EditorRenderActionProps = {
  view: EditorView | null;
  resetEditor: () => void;
};

export type EditorProps = {
  content?: string | unknown;
  readonly?: boolean;
  className?: string;
  renderActions?: (props: EditorRenderActionProps) => React.ReactNode;
};
