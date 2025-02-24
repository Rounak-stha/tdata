import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { slashMenuPluginKey } from "..";
import { CommandFunction, Command } from "../types";

import { Heading1, Heading2, List, ListOrdered, Quote, Table2, Code } from "lucide-react";
import { wrapInList } from "prosemirror-schema-list";
import { setBlockType, wrapIn } from "prosemirror-commands";

export const createSlashCommand = (command: CommandFunction): CommandFunction => {
  return (state: EditorState, dispatch?: EditorView["dispatch"]) => {
    if (!dispatch) return command(state, undefined);

    const pluginState = slashMenuPluginKey.getState(state);
    if (!pluginState?.slashPos) return command(state, dispatch);

    // Create a transaction to delete the slash
    const deleteSlashTr = state.tr.delete(pluginState.slashPos, state.selection.from);

    // NOTE: I do not understand the mapping it does here
    // If you do, please explain it to me

    // Execute the command and combine transactions
    const success = command(state, (commandTr) => {
      // Map the command's transaction positions to account for the deletion
      const mappedTr = state.tr;

      deleteSlashTr.steps.forEach((step) => mappedTr.step(step)); // Apply the slash deletion first

      // Map the positions in the command's transaction using the mapping from the slash deletion
      const mapping = deleteSlashTr.mapping;
      commandTr.steps.forEach((step) => {
        const mappedStep = step.map(mapping);
        if (mappedStep) mappedTr.step(mappedStep);
      });

      dispatch(mappedTr); // Dispatch the combined transaction
    });
    return success;
  };
};

export const NodeTypeOffset = {
  paragraph: 0,
  heading: 32,
};

export const Commands: Command[] = [
  {
    title: "Heading 1",
    icon: Heading1,
    execute: createSlashCommand((state, dispatch) => {
      const node = state.schema.nodes.heading;
      return setBlockType(node, { level: 1 })(state, dispatch);
    }),
  },
  {
    title: "Heading 2",
    icon: Heading2,
    execute: createSlashCommand((state, dispatch) => {
      const node = state.schema.nodes.heading;
      return setBlockType(node, { level: 2 })(state, dispatch);
    }),
  },
  {
    title: "Bullet List",
    icon: List,
    execute: createSlashCommand((state, dispatch) => wrapInList(state.schema.nodes.bullet_list)(state, dispatch)),
  },
  {
    title: "Numbered List",
    icon: ListOrdered,
    execute: createSlashCommand((state, dispatch) => wrapInList(state.schema.nodes.ordered_list)(state, dispatch)),
  },
  {
    title: "Quote",
    icon: Quote,
    execute: createSlashCommand((state, dispatch) => wrapIn(state.schema.nodes.blockquote)(state, dispatch)),
  },
  {
    title: "Code Block",
    icon: Code,
    execute: createSlashCommand((state, dispatch) => {
      const node = state.schema.nodes.code_block;
      return setBlockType(node)(state, dispatch);
    }),
  },
  {
    title: "Table",
    icon: Table2,
    execute: createSlashCommand((state, dispatch) => {
      if (!dispatch) return true;

      const { schema } = state;
      const table = schema.nodes.table.create({}, [
        schema.nodes.table_row.create({}, [
          schema.nodes.table_cell.create({}, [schema.nodes.paragraph.create()]),
          schema.nodes.table_cell.create({}, [schema.nodes.paragraph.create()]),
        ]),
      ]);

      dispatch(state.tr.replaceSelectionWith(table));
      return true;
    }),
  },
];
