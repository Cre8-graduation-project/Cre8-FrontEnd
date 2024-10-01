import { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import classes from "./JobList.module.css";

export default function JobListSortBar({ pageType, pageObj, setObj }) {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const recSortObj = [
    {
      name: "최신 등록 순",
      sort: ["createdAt,desc"],
    },
    {
      name: "마감일 순",
      sort: ["deadLine,asc"],
    },
    {
      name: "요구 경력 낮은 순",
      sort: ["hopeCareerYear,asc"],
    },
    {
      name: "요구 경력 높은 순",
      sort: ["hopeCareerYear,desc"],
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
  ];
  const sortObj = pageType === "recruit" ? recSortObj : jobSortObj;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handleBtnClick = (index) => {
    setSelectedItemIndex(index);
    setObj({
      ...pageObj,
      sort: sortObj[index].sort,
    });
  };

  const handleSelectChange = (event) => {
    setSelectedItemIndex(event.target.value);
    setObj({
      ...pageObj,
      sort: sortObj[event.target.value].sort,
    });
  }

  return (
    <>
      {!matchDownSm && (
        <ul className={classes.jobListSortBar}>
          {sortObj.map((menu, index) => (
            <li key={`btn${index}`}>
              <Button
                onClick={() => handleBtnClick(index)}
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
      )}
      {matchDownSm && (
        <div className={classes.jobListSortSelect}>
          <FormControl size="small">
            <InputLabel id="job-sort-select-label">정렬 설정</InputLabel>
            <Select
              labelId="job-sort-select-label"
              value={selectedItemIndex}
              label="정렬 설정"
              onChange={handleSelectChange}
            >
              {sortObj.map((menu, index) => (
                <MenuItem value={index} key={`SORT_SELECT_${index}`}>{menu.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
    </>
  );
}
