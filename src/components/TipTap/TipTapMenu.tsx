import {
  Bold,
  Code,
  ImageIcon,
  Italic,
  Link,
  ListBulleted,
  ListOrdered,
  Redo,
  StrikeThrough,
  Underline,
  Undo,
} from "@/assets/Icons";
import { Editor } from "@tiptap/react";
import { useEffect } from "react";
import { ColorDropDown } from "./ColorDropdown";
import { Dialog } from "./Dialog";
import { DropDown } from "./Dropdown";
import styles from "./TipTap.module.scss";

interface ActionsProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: React.ReactNode;
  isActive?: boolean;
}

interface TipTapMenuProps {
  editor: Editor | null;
}

const fonts = [
  { name: "Arial", value: "Arial" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Verdana", value: "Verdana" },
];
const fontSizes = [
  { name: "8", value: "8" },
  { name: "10", value: "10" },
  { name: "12", value: "12" },
  { name: "14", value: "14" },
  { name: "16", value: "16" },
  { name: "18", value: "18" },
  { name: "20", value: "20" },
  { name: "22", value: "22" },
  { name: "24", value: "24" },
  { name: "26", value: "26" },
  { name: "28", value: "28" },
  { name: "30", value: "30" },
  { name: "32", value: "32" },
];
const textAlign = [
  { name: "Esquerda", value: "left" },
  { name: "Centro", value: "center" },
  { name: "Direita", value: "right" },
  { name: "Justificar", value: "justify" },
];
const colors = [
  { name: "black", value: "#212529" },
  {
    name: "violet",
    value: "#845EF7",
  },
  { name: "blue", value: "#339AF0" },
  { name: "cyan", value: "#22B8CF" },
  { name: "green", value: "#51CF66" },
  { name: "yellow", value: "#FCC419" },
  { name: "red", value: "#FF6B6B" },
  {
    name: "pink",
    value: "#F06595",
  },
  { name: "gray", value: "#CED4DA" },
  { name: "violet-5", value: "#5F3DC4" },
  { name: "blue-9", value: "#1864AB" },
  { name: "cyan-9", value: "#0B7285" },
  {
    name: "green-9",
    value: "#2B8A3E",
  },
  {
    name: "yellow-9",
    value: "#E67700",
  },
  {
    name: "red-9",
    value: "#C92A2A",
  },
  {
    name: "pink-8",
    value: "#C2255C",
  },
];

export function TipTapMenu({ editor }: TipTapMenuProps) {
  useEffect(() => {
    editor?.commands.setFontFamily("Arial");
    editor?.commands.setFontSize("16");
  }, []);

  if (!editor) return;

  const handleFontChange = (value: string) => {
    editor.commands.setFontFamily(value);
  };

  const handleFontSizeChange = (value: string) => {
    editor.commands.setFontSize(value);
  };

  const handleTextAlignChange = (value: string) => {
    editor.commands.setTextAlign(value);
  };

  const handleColorChange = (value: string) => {
    editor.commands.setColor(value);
  };

  const handleAddLink = (value: string, action: "remove" | "add") => {
    if (action === "add") {
      editor.commands.setLink({ href: value, target: "_blank" });
    } else if (action === "remove") {
      editor.commands.unsetLink();
    }
  };

  const handleAddImage = (value: string, action: "remove" | "add") => {
    if (action === "add") {
      editor?.commands.setImage({
        src: value,
        alt: "image",
        title: "image",
      });
    }
  };

  return (
    <div className={styles.textEditor__menu}>
      <div className={styles.textEditor__menu__iconContainer}>
        <ActionButton
          icon={<Undo />}
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ActionButton
          icon={<Redo />}
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().chain().focus().redo().run()}
        />
      </div>
      <DropDown
        options={fonts}
        onChange={handleFontChange}
        defaultValue="Arial"
        listWidth="180px"
        height="180px"
        font
        editor={editor}
      />
      <DropDown
        options={fontSizes}
        onChange={handleFontSizeChange}
        defaultValue="16"
        listWidth="130px"
        height="130px"
        editor={editor}
      />
      <DropDown
        options={textAlign}
        onChange={handleTextAlignChange}
        defaultValue="left"
        icon
        listWidth="130px"
        height="170px"
        editor={editor}
      />
      <ColorDropDown
        defaultValue="#212529"
        onChange={handleColorChange}
        options={colors}
      />
      <div className={styles.textEditor__menu__iconContainer}>
        <ActionButton
          icon={<Bold />}
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
        />
        <ActionButton
          icon={<Italic />}
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
        />
        <ActionButton
          icon={<Underline />}
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().toggleUnderline()}
        />
        <ActionButton
          icon={<StrikeThrough />}
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
        />
      </div>

      <div className={styles.textEditor__menu__iconContainer}>
        <ActionButton
          icon={<ListBulleted />}
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().toggleBulletList()}
        />
        <ActionButton
          icon={<ListOrdered />}
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().toggleOrderedList()}
        />
      </div>

      <div className={styles.textEditor__menu__iconContainer}>
        <Dialog
          editor={editor}
          onChange={handleAddLink}
          icon={<Link />}
          type="link"
        />
        <Dialog
          editor={editor}
          onChange={handleAddImage}
          icon={<ImageIcon />}
          type="image"
        />
        <ActionButton
          icon={<Code />}
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().toggleCode()}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, isActive = false, ...props }: ActionsProps) {
  return (
    <button
      {...props}
      className={`${styles.actionButton} ${isActive ? styles.active : ""}`}
    >
      {icon}
    </button>
  );
}
