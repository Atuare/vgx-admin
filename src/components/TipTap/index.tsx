import { useEffect } from "react";
import styles from "./TipTap.module.scss";
import "./tiptap.scss";

import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

import { TextStyleExtended } from "@/utils/fontsize";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TipTapMenu } from "./TipTapMenu";

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

  useEffect(() => {
    if (editor?.getJSON()) getContentFromEditor(editor?.getJSON());
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
