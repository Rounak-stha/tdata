import { baseKeymap } from 'prosemirror-commands';
import { Schema } from 'prosemirror-model';
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { toggleMark } from 'prosemirror-commands';

export function buildKeymap(schema: Schema) {  // Remove default null value
  const keys = {
    ...baseKeymap,
    'Mod-b': toggleMark(schema.marks.strong),
    'Mod-i': toggleMark(schema.marks.em),
    'Mod-`': toggleMark(schema.marks.code),
    'Shift-Ctrl-8': wrapInList(schema.nodes.bullet_list),
    'Shift-Ctrl-9': wrapInList(schema.nodes.ordered_list),
    'Enter': splitListItem(schema.nodes.list_item),
    'Mod-[': liftListItem(schema.nodes.list_item),
    'Mod-]': sinkListItem(schema.nodes.list_item),
    'Shift-Enter': (state: any, dispatch: any) => {
      if (!schema.nodes.hard_break) return false;
      dispatch(state.tr.replaceSelectionWith(schema.nodes.hard_break.create()).scrollIntoView());
      return true;
    },
  };

  return keys;
}