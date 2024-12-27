import { inputRules, wrappingInputRule, textblockTypeInputRule, smartQuotes } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';

export function buildInputRules(schema: Schema) {
  const rules = smartQuotes.concat([
    // Headers: # Heading
    textblockTypeInputRule(
      /^(#{1,6})\s$/,
      schema.nodes.heading,
      match => ({ level: match[1].length })
    ),

    // Bullet lists: "* " or "- "
    wrappingInputRule(
      /^\s*([-*])\s$/,
      schema.nodes.bullet_list
    ),

    // Ordered lists: "1. "
    wrappingInputRule(
      /^\s*(\d+)\.\s$/,
      schema.nodes.ordered_list
    ),

    // Blockquotes: "> "
    wrappingInputRule(
      /^\s*>\s$/,
      schema.nodes.blockquote
    ),

    // Code blocks: ```
    textblockTypeInputRule(
      /^```$/,
      schema.nodes.code_block
    ),
  ]);

  return inputRules({ rules });
}