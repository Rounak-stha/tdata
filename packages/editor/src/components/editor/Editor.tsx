"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "../../lib/schema";
import { getPlugins } from "../../lib/plugins";
// import { MenuBar } from './MenuBar'
import { SlashMenu } from "./SlashMenu";
import { slashMenuPluginKey } from "../../lib/plugins/slash-menu";
import { getMenuPosition } from "../../lib/plugins/slash-menu/utils";
import { ContentRefValue } from "@tdata/shared/types";
import { EditorProps, EditorRenderActionProps } from "../../types";

// min-h-[300px]
export const Editor = forwardRef<ContentRefValue, EditorProps>(function Editor({ content, readonly = false, className, renderActions }, ref) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [slashMenu, setSlashMenu] = useState<{
    open: boolean;
    position: { top: number; left: number };
  } | null>(null);

  const rednerActionProps: EditorRenderActionProps = {
    view: viewRef.current,
    resetEditor: () => {
      if (viewRef.current) {
        const emptyDoc = schema.nodes.doc.create(); // Create an empty document
        const transaction = viewRef.current.state.tr.replaceWith(0, viewRef.current.state.doc.content.size, emptyDoc);
        viewRef.current.dispatch(transaction); // Dispatch the transaction to clear the content
        setIsEmpty(true); // Set isEmpty to true
      }
    },
  };

  useImperativeHandle(ref, () => ({
    getContent: () => {
      const json = viewRef?.current?.state.doc.toJSON();
      if (json) {
        return JSON.stringify(json);
      }
      return "";
    },
    getJSON: () => {
      const json = viewRef?.current?.state.doc.toJSON();
      if (json) {
        return json;
      }
      return {};
    },
    getExcerpt: () => {
      const parsedContent = viewRef?.current?.state.doc.content.textBetween(0, viewRef.current.state.doc.content.size, "\n\n");
      if (parsedContent) {
        return parsedContent.slice(0, 200);
      }
      return "";
    },
  }));

  useEffect(() => {
    if (!editorRef.current) return;
    const parsedContent = (() => {
      try {
        return content ? (typeof content == "string" ? schema.nodeFromJSON(JSON.parse(content)) : schema.nodeFromJSON(content)) : undefined;
      } catch {
        return undefined;
      }
    })();
    const state = EditorState.create({
      doc: parsedContent,
      schema,
      plugins: getPlugins(),
    });

    const view = new EditorView(editorRef.current, {
      state,
      editable: () => !readonly,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        setIsEmpty(newState.doc.nodeSize <= 4); // ChatGPT suggested that an empty editor woudld have size <= 2 but since we have custom schema, for us the size is <= 4

        // Update slash menu state
        const slashState = slashMenuPluginKey.getState(newState);
        if (slashState && slashState.open && slashState.position !== null) {
          const position = getMenuPosition(view, slashState.slashPos as number);

          setSlashMenu({
            open: true,
            position,
          });
        } else {
          setSlashMenu(null);
        }
      },
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    });

    viewRef.current = view;

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={`bg-inherit w-full relative ${className}`}>
      {/* {viewRef.current && <MenuBar view={viewRef.current} />} */}
      <div ref={editorRef} />
      {slashMenu?.open && viewRef.current && <SlashMenu view={viewRef.current} position={slashMenu.position} onClose={() => setSlashMenu(null)} />}
      {!isEmpty && renderActions && renderActions(rednerActionProps)}
    </div>
  );
});
