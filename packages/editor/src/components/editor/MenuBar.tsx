import React from "react";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { Bold, Italic, Code, List, ListOrdered, Quote, Heading1, Heading2, Table } from "lucide-react";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import { wrapInList } from "prosemirror-schema-list";
import { schema } from "../../lib/schema";

interface MenuBarProps {
  view: EditorView;
}

interface MenuButton {
  icon: React.ElementType;
  title: string;
  command: (state: EditorState, dispatch: EditorView["dispatch"]) => boolean;
}

export function MenuBar({ view }: MenuBarProps) {
  const buttons: MenuButton[] = [
    {
      icon: Bold,
      title: "Bold",
      command: toggleMark(schema.marks.strong),
    },
    {
      icon: Italic,
      title: "Italic",
      command: toggleMark(schema.marks.em),
    },
    {
      icon: Code,
      title: "Code",
      command: toggleMark(schema.marks.code),
    },
    {
      icon: List,
      title: "Bullet List",
      command: wrapInList(schema.nodes.bullet_list),
    },
    {
      icon: ListOrdered,
      title: "Ordered List",
      command: wrapInList(schema.nodes.ordered_list),
    },
    {
      icon: Quote,
      title: "Blockquote",
      command: wrapIn(schema.nodes.blockquote),
    },
    {
      icon: Heading1,
      title: "Heading 1",
      command: setBlockType(schema.nodes.heading, { level: 1 }),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      command: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    {
      icon: Table,
      title: "Insert Table",
      command: (state, dispatch) => {
        if (dispatch) {
          const tr = state.tr.replaceSelectionWith(
            schema.nodes.table.create({}, [schema.nodes.table_row.create({}, [schema.nodes.table_cell.create(), schema.nodes.table_cell.create()])]),
          );
          dispatch(tr);
        }
        return true;
      },
    },
  ];

  const handleClick = (command: MenuButton["command"]) => {
    command(view.state, view.dispatch);
    view.focus();
  };

  return (
    <div className="flex items-center h-[52px] gap-1 px-2 border-b border-border bg-inherit sticky top-0 z-10">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <button key={index} onClick={() => handleClick(button.command)} className="p-2 hover:bg-muted rounded-lg transition-colors" title={button.title}>
            <Icon className="w-5 h-5 text-gray-600 hover:text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}
