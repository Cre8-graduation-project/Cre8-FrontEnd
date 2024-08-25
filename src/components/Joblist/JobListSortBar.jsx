import { useState } from "react";
import { Button, Divider } from "@mui/material";
import classes from "./JobList.module.css";

export default function JobListSortBar({ setObj }) {
  const sortMenu = [
    "최신 등록 순",
    "마감일 순",
    "요구 경력 낮은 순",
    "요구 경력 높은 순",
  ];
  const sortObj = [
    {
      sort: ["createdAt"],
      direction: "desc",
    },
    {
      sort: ["deadline"],
      direction: "asc",
    },
    {
      sort: ["hopeCareer"],
      direction: "asc",
    },
    {
      sort: ["createdAt"],
      direction: "desc",
    },
  ];

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handleBtnClick = (index) => {
    setSelectedItemIndex(index);
    setObj((prevObj) => {
      return {
        ...prevObj,
        ...sortObj[index]
      };
    });
  };

  return (
    <ul className={classes.jobListSortBar}>
      {sortMenu.map((menu, index) => (
        <li key={`btn${index}`}>
          <Button
            onClick={() => {
              handleBtnClick(index);
            }}
            sx={selectedItemIndex == index 
              ? {color: "#512DA8"} 
              : {color: "#1f1d1b"}
            }
            disabled={false}
          >
            {menu}
          </Button>
          {!(index == sortMenu.length - 1) && (
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ borderColor: "#aeaba7" }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
