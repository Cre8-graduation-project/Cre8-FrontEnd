
import classes from './ChatComponent.module.css';

export default function ChatTopBar({ name }) {
  return <div className={classes.chatTopBar}>
    <h3>{name}</h3>
  </div>
}