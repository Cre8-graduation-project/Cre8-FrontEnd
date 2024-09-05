import { Chip } from "@mui/material";
import classes from "./Tag.module.css";

export default function TagChildSelector({ title, tagList, selectedElement, setElement }) {
  const handleClick = (tagID) => {
    if(selectedElement.includes(tagID)) {
      //console.log("deleting tag")
      setElement(selectedElement.filter(id => id !== tagID));
    } else {
      //console.log("adding tag")
      setElement([...selectedElement, tagID]);
    }
  };

  return (
    <div className={`${classes.tagSelector} ${classes.tagChildSelector}`}>
      <h4>{title}</h4>
      <ul>
        {tagList &&
          tagList.map((tag, index) => (
            <li className={classes.chip} key={index}>
              <Chip
                label={tag.name}
                color={(selectedElement.includes(tag.workFieldChildTagId)) ? "primary" : "default"}
                onClick={() => {
                  handleClick(tag.workFieldChildTagId);
                }}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
