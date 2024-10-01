import React from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
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
  RiYoutubeLine,
} from "@remixicon/react";
import { Divider } from "@mui/material";

export const EditorMenuBar = ({ editor }) => {
  const [isYoutubeOpen, setIsYoutubeOpen] = useState(false);
  const [isURLokay, setIsURLokay] = useState(true);

  if (!editor) {
    return null;
  }

  const handleYoutubeOpen = () => {
    setIsYoutubeOpen(true);
  };
  const handleYoutubeClose = () => {
    setIsYoutubeOpen(false);
  };
  const addYoutubeVideo = (e) => {
    e.preventDefault();
    const youtubeVideoUrl = e.target.elements.youtubeVideoUrl.value;

    if (youtubeVideoUrl.includes("youtube.com/watch?v=")) {
      editor.commands.setYoutubeVideo({
        src: youtubeVideoUrl,
      });
      handleYoutubeClose();
      setIsURLokay(true);
    } else {
      setIsURLokay(false);
    }
  };

  return (
    <>
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
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
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
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <RiSubtractLine size={20} />
        </button>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ borderColor: "#aeaba7" }}
        />
        <button onClick={handleYoutubeOpen}>
          <RiYoutubeLine size={20} />
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
      <Dialog
        open={isYoutubeOpen}
        onClose={handleYoutubeClose}
        PaperProps={{
          component: "form",
          onSubmit: (e) => {
            addYoutubeVideo(e);
            setIsURLokay(true);
          },
        }}
      >
        <DialogTitle>유튜브 영상 첨부</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isURLokay
              ? "첨부할 유튜브 영상의 주소를 입력해주세요."
              : "올바른 유튜브 영상 URL을 입력해주세요."}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="youtubeVideoUrl"
            label="유튜브 영상 URL"
            type="url"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions sx={{ padding: "0 1rem 1rem 1rem" }}>
          <Button onClick={handleYoutubeClose}>취소</Button>
          <Button type="submit" variant="contained">
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ReadOnlyEditor = ({ content }) => {
  let contentData;
  try {
    contentData = JSON.parse(content);
  } catch (e) {
    contentData = [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: `${content}`,
          },
        ],
      },
    ];
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
    types: ['paragraph', 'div[data-youtube-video]'],
    alignments: ["left", "center", "right"],
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    rel: "noopener noreferrer",
  }),
  Youtube.configure({
    inline: true,
  }),
];
