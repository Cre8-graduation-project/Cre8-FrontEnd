import { Avatar } from "@mui/material";
import classes from "./ChatComponent.module.css";

export default function ChatListCard({ name, message, onClick }) {
  return (
    <div className={classes.chatCard} onClick={onClick}>
      <Avatar>
      </Avatar>
      <div>
        <h4>{name}</h4>
        <p>{message}</p>
      </div>
    </div>
  );
}