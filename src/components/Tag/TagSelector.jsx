import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { RiArrowLeftLine } from "@remixicon/react";
import classes from "./Tag.module.css";

export default function TagSelector({ title, tagList, selectedTag, setTag }) {
  const handleClick = (tagID) => {
    setTag(tagID);
  };

  return (
    <div className={classes.tagSelector}>
      <h4>{title}</h4>
      <ul>
        {tagList &&
          tagList.map((tag, index) => (
            <li className={classes.chip} key={index}>
              <Chip
                label={tag.name}
                color={(selectedTag == tag.workFieldTagId) ? "primary" : "default"}
                onClick={() => {
                  handleClick(tag.workFieldTagId);
                }}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
