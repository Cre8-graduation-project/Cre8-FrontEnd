import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { RiImage2Fill } from "@remixicon/react";
import classes from "./ChatComponent.module.css";

export default function ChatInputBar({ handleChatSend }) {
  const [chatInput, setChatInput] = useState("");
  
  const handleSend = (e) => {
    e.preventDefault();
    if(chatInput == '') return;

    handleChatSend(chatInput);
    setChatInput('');
  }

  const onChatInput = (e) => {
    setChatInput(e.target.value ?? "");
  }
  
  return (
    <form onSubmit={handleSend} className={classes.chatInputBar}>
      <TextField
        name="chatInput"
        variant="outlined"
        size="small"
        multiline
        minRows={2}
        fullWidth
        sx={{ "& .MuiInputBase-root": { background: "var(--color-gray-100)" } }}
        onChange={onChatInput}
      />
      <div className={classes.chatInputBarButtonRow}>
        <Button
          size="small"
          variant="contained"
          color="inherit"
          sx={{ minWidth: "35px", padding: "0", aspectRatio: "1/1" }}
        >
          <RiImage2Fill size={20} />
        </Button>
        <Button type="submit" size="small" variant="contained" color="primary">
          전송
        </Button>
      </div>
    </form>
  );
}
