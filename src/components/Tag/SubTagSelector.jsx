import { Chip } from "@mui/material";
import classes from "./Tag.module.css";

export default function SubTagSelector({ tagList, selectedTag, setTag, toggle = false }) {
  const handleClick = (name) => {
    setTag(name);
    if(selectedTag == name && toggle) {
      setTag();
    }
  };

  return (
    <ul>
      {tagList &&
        tagList.map((tag, index) => (
          <li className={classes.chip} key={index}>
            <Chip
              label={tag}
              color={(selectedTag == tag) ? "primary" : "default"}
              onClick={() => {
                handleClick(tag);
              }}
            />
          </li>
        ))}
    </ul>
  );
}
