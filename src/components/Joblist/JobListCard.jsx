import { useTheme, useMediaQuery } from "@mui/material";
import { errorImage } from "../../assets/images/imageProvider";
import TagList from "../Tag/TagList";
import classes from "./JobList.module.css";

export function RecruitListCard({ itemData, onClick = () => {} }) {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {!matchDownSm && (
        <JobRecruitCard
          itemData={itemData}
          detailData={`${itemData.companyName} | ${itemData.enrollDurationType}`}
          onClick={onClick}
        />
      )}
      {matchDownSm && (
        <JobRecruitCardSm
          itemData={itemData}
          detailData={`${itemData.companyName} | ${itemData.enrollDurationType}`}
          onClick={onClick}
        />
      )}
    </>
  );
}

export function JobListCard({ itemData, onClick = () => {} }) {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {!matchDownSm && (
        <JobRecruitCard
          itemData={itemData}
          detailData={`${itemData.memberName?.replace(/..$/, "**")} | ${itemData.sex} | ${itemData.year}년생`}
          onClick={onClick}
        />
      )}
      {matchDownSm && (
        <JobRecruitCardSm
          itemData={itemData}
          detailData={`${itemData.memberName?.replace(/..$/, "**")} | ${itemData.sex} | ${itemData.year}년생`}
          onClick={onClick}
        />
      )}
    </>
  );
}

function JobRecruitCard({ itemData, detailData, onClick }) {
  return (
    <div className={classes.jobListCard} onClick={onClick}>
      <img src={itemData.accessUrl || errorImage} alt={itemData.title} />
      <div className={classes.jobListCardText}>
        <h3>{itemData.title}</h3>
        <h5>{detailData}</h5>
        <TagList tagList={itemData.tagNameList} />
      </div>
    </div>
  );
}

function JobRecruitCardSm({ itemData, detailData, onClick }) {
  return (
    <div
      className={`${classes.jobListCard} ${classes.jobListCardSm}`}
      onClick={onClick}
    >
      <div className={classes.jobListCardContentSm}>
        <img src={itemData.accessUrl || errorImage} alt={itemData.title} />
        <div
          className={`${classes.jobListCardText} ${classes.jobListCardTextSm}`}
        >
          <h3>{itemData.title}</h3>
          <h5>{detailData}</h5>
        </div>
      </div>
      <TagList tagList={itemData.tagNameList} small={true}/>
    </div>
  );
}
