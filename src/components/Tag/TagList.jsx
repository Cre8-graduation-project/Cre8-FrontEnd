import { Chip } from "@mui/material";
import classes from "./Tag.module.css";

export default function TagList({ tagList, small = false }) {
  return (
    <ul className={classes.tagList}>
      {tagList.map((tag, index) => (
        <li className={classes.chip} key={index}>
          <Chip size={small ? "small" : ""} label={tag}/>
        </li>
      ))}
    </ul>
  );
}
