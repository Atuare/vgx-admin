import styles from "./TipTap.module.scss";
import "./tiptap.scss";

import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useMemo } from "react";
import { TipTapMenu } from "./TipTapMenu";
import { TextStyleExtended } from "@/utils/fontsize";

export function TipTap({
  content,
  getContentFromEditor,
}: {
  content?: any;
  getContentFromEditor: (content: any) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      Underline,
      FontFamily,
      Link,
      TextStyleExtended,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
    ],
    content: content ? content : "",
  });

  useMemo(() => {
    if (editor?.getHTML()) getContentFromEditor(editor?.getJSON());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON()]);

  return (
    <div className={styles.textEditor}>
      <TipTapMenu editor={editor} />
      <div
        onClick={() => editor?.chain().focus()}
        style={{ height: "224px", cursor: "text", width: "100%" }}
      >
        <EditorContent editor={editor} className={styles.editorContainer} />
      </div>
    </div>
  );
}
