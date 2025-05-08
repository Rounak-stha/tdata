import { unified } from "unified";
import remarkStringify from "remark-stringify";
import { fromProseMirror, fromPmNode, fromPmMark } from "@handlewithcare/remark-prosemirror";
import remarkGfm from "remark-gfm";

import { schema } from "@tdata/editor";

export const proseMirrorToMarkdown = (doc: unknown) => {
  // Convert to mdast with the fromProseMirror util.
  // It takes a schema, a set of node handlers, and a
  // set of mark handlers, each of which converts a
  // ProseMirror node or mark to an mdast node.
  const node = schema.nodeFromJSON(doc);
  const mdast = fromProseMirror(node, {
    schema: schema,
    nodeHandlers: {
      // Simple nodes can be converted with the fromPmNode
      // util.
      heading: fromPmNode("heading"),
      paragraph: fromPmNode("paragraph"),
      list_item: fromPmNode("listItem"),
      // You can set mdast node properties from the
      // ProseMirror node or its attrs
      ordered_list: fromPmNode("list", () => ({
        ordered: true,
      })),
      bullet_list: fromPmNode("list", () => ({
        ordered: false,
      })),
      table: fromPmNode("table"),
      table_row: fromPmNode("tableRow"),
      table_cell: fromPmNode("tableCell"),
      blockquote: fromPmNode("blockquote"),
      code_block: fromPmNode("code"),
    },
    markHandlers: {
      // Simple marks can be converted with the fromPmMark
      // util.
      em: fromPmMark("emphasis"),
      strong: fromPmMark("strong"),
      // Again, mdast node properties can be set from the
      // ProseMirror mark attrs
      link: fromPmMark("link", (mark) => ({
        url: mark.attrs["href"],
        title: mark.attrs["title"],
      })),
    },
  });

  return unified().use(remarkGfm).use(remarkStringify).stringify(mdast);
};
