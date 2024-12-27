import { Schema } from 'prosemirror-model';
import { nodes as basicNodes, marks } from 'prosemirror-schema-basic';
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list';
import { tableNodes } from 'prosemirror-tables';

const nodes = {
  ...basicNodes,
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: { default: null },
      colspan: { default: 1 },
      rowspan: { default: 1 }
    }
  }),
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block',
  },
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block',
  },
  list_item: {
    ...listItem,
    content: 'paragraph block*',
    group: 'block',
  },
  paragraph: {
    ...basicNodes.paragraph,
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0];
    },
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return ['blockquote', 0];
    },
  },
};

export const schema = new Schema({
  nodes,
  marks: {
    ...marks,
    link: {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: false,
      parseDOM: [{
        tag: 'a[href]',
        getAttrs(dom: HTMLElement) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title')
          };
        }
      }],
      toDOM(node) {
        return ['a', node.attrs, 0];
      }
    }
  },
});