import { Chip } from "@mui/material";
import classes from "./Tag.module.css";
import { useEffect, useState } from "react";

export default function ExpTagSelector({ selectedExp, setExpTag, updateObj }) {
  const expObjList = [
    {
      name: "신입",
      searchObj: {
        minCareer: 0,
        maxCareer: 1,
      }
    },
    {
      name: "1년 이상 ~ 3년 미만",
      searchObj: {
        minCareer: 1,
        maxCareer: 3,
      }
    },
    {
      name: "3년 이상 ~ 5년 미만",
      searchObj: {
        minCareer: 3,
        maxCareer: 5,
      }
    },
    {
      name: "5년 이상 ~",
      searchObj: {
        minCareer: 5,
        maxCareer: null,
      }
    }
  ]
  const [selectedExpTag, setSelectedExpTag] = useState(selectedExp);

  // Reset Selected Experience Tag when outside data is changed
  useEffect(() => {
    setSelectedExpTag(selectedExp);
  }, [selectedExp])

  const handleClick = (index) => {
    if(selectedExpTag === index) {
      setSelectedExpTag(null);
      setExpTag({selectedExpTag: null});
      updateObj({minCareer: null, maxCareer: null});
    } else {
      setSelectedExpTag(index);
      setExpTag({selectedExpTag: index});
      updateObj(expObjList[index].searchObj);
    }
  };

  return (
    <div className={classes.tagSelector}>
      <h4>경력</h4>
      <ul>
        {expObjList.map((tag, index) => (
          <li className={classes.chip} key={index}>
            <Chip
              label={tag.name}
              color={(selectedExpTag == index) ? "primary" : "default"}
              onClick={() => {
                handleClick(index);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
