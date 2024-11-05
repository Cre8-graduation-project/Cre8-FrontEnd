import { timeSince } from "../../provider/utilityProvider";
import classes from "./CommComponent.module.css";

export default function CommunityPostCard({ item, onClick = () => {} }) {
  return (
    <div
      className={classes.communityPostLink}
      onClick={onClick}
    >
      <span>
        <h4>{item.title}</h4>
        <h4 style={{ color: "var(--color-warning)" }}>[{item.replyCount}]</h4>
      </span>
      <p>
        {item.writerNickName} | {timeSince(item.createdAt) || '?'}
      </p>
    </div>
  );
}
