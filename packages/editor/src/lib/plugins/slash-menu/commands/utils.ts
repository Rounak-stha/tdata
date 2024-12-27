import { EditorState, Transaction } from 'prosemirror-state';

export const chainTransactions = (tr1: Transaction, tr2: Transaction, state: EditorState): Transaction => {
  return tr1.setSelection(state.selection)
    .replaceWith(tr1.selection.from, tr1.selection.to, tr2.doc);
};