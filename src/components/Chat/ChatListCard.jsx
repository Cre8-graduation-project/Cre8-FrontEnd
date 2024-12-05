import { Avatar } from "@mui/material";
import classes from "./ChatComponent.module.css";

export default function ChatListCard({ name, message, accessUrl, unReadCount, onClick }) {
  return (
    <div className={classes.chatCard} onClick={onClick}>
      <Avatar src={accessUrl} />
      <div className={classes.chatCardContent}>
        <h4>{name}</h4>
        <p>{message}</p>
      </div>
      {unReadCount > 0 && <div className={classes.chatCardUnReadCount}>{unReadCount}</div>}
    </div>
  );
}