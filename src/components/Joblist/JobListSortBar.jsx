import { useState } from "react";
import { Button, Divider } from "@mui/material";
import classes from "./JobList.module.css";

export default function JobListSortBar({ pageType, pageObj, setObj }) {
  const recSortObj = [
    {
      name: "최신 등록 순",
      sort: ["createdAt,desc"],
    },
    {
      name: "마감일 순",
      sort: ["deadline,asc"],
    },
    {
      name: "요구 경력 낮은 순",
      sort: ["hopeCareer,asc"],
    },
    {
      name: "요구 경력 높은 순",
      sort: ["hopeCareer,desc"],
    },
  ];
  const jobSortObj = [
    {
      name: "최신 등록 순",
      sort: ["createdAt,desc"],
    },
    {
      name: "경력 낮은 순",
      sort: ["careerYear,asc"],
    },
    {
      name: "경력 높은 순",
      sort: ["careerYear,desc"],
    },
  ]
  const sortObj = pageType === "recruit" ? recSortObj : jobSortObj;

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handleBtnClick = (index) => {
    setSelectedItemIndex(index);
    setObj({
      ...pageObj,
      sort: sortObj[index].sort,
    });
  };

  return (
    <ul className={classes.jobListSortBar}>
      {sortObj.map((menu, index) => (
        <li key={`btn${index}`}>
          <Button
            onClick={() => {
              handleBtnClick(index);
            }}
            sx={
              selectedItemIndex == index
                ? { color: "#512DA8" }
                : { color: "#1f1d1b" }
            }
            disabled={false}
          >
            {menu.name}
          </Button>
          {!(index == sortObj.length - 1) && (
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
