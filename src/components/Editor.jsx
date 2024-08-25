import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import classes from "./Editor.module.css";

import {
  RiBold,
  RiStrikethrough2,
  RiListUnordered,
  RiListOrdered2,
  RiSubtractLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiUnderline,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
} from "@remixicon/react";
import { Divider } from "@mui/material";

export const EditorMenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={classes.editorMenuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <RiBold size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <RiStrikethrough2 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <RiUnderline size={20} />
      </button>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ borderColor: "#aeaba7" }}
      />
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <RiAlignLeft size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <RiAlignCenter size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <RiAlignRight size={20} />
      </button>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ borderColor: "#aeaba7" }}
      />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <RiListUnordered size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <RiListOrdered2 size={20} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <RiSubtractLine size={20} />
      </button>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ borderColor: "#aeaba7" }}
      />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <RiArrowGoBackLine size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RiArrowGoForwardLine size={20} />
      </button>
    </div>
  );
};

export const ReadOnlyEditor = ({ content }) => {
  let contentData;
  try {
    contentData = JSON.parse(content);
  } catch (e) {
    contentData = [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: `${content}`,
          },
        ],
      },
    ]
  }

  const editor = useEditor({
    editable: false,
    extensions: editorExtensions,
    content: content
      ? {
          type: "doc",
          content: contentData,
        }
      : "",
    editorProps: {
      attributes: {
        style: "padding: 0.3rem 0;",
      },
    },
  });

  return (
    <div className={classes.editor}>
      <EditorContent editor={editor} />
    </div>
  );
};

export const editorExtensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ["paragraph"],
    alignments: ["left", "center", "right"],
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    rel: "noopener noreferrer",
  }),
];
