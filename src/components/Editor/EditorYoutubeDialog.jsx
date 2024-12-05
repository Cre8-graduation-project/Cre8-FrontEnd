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

export default function EditorYoutubeDialog({ editor, open, onClose }) {
  const [isURLokay, setIsURLokay] = useState(true);

  const addYoutubeVideo = (e) => {
    e.preventDefault();
    const youtubeVideoUrl = e.target.elements.youtubeVideoUrl.value;

    if (youtubeVideoUrl.includes("youtube.com/watch?v=")) {
      editor.commands.setYoutubeVideo({
        src: youtubeVideoUrl,
      });
      onClose();
      setIsURLokay(true);
    } else {
      setIsURLokay(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          sx={{ marginTop: "1.3rem" }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "0 1rem 1rem 1rem" }}>
        <Button onClick={onClose}>취소</Button>
        <Button type="submit" variant="contained">
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
