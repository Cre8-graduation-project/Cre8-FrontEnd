import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Link } from "@mui/material";
import apiInstance from "../../provider/networkProvider";
import classes from "./HomeComponent.module.css";

export default function HomeCommunityCard({ title, boardID }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    HomeCommunityListRequest(boardID).then((res) => {
      setData(res);
    });
  }, []);

  const handleLinkClick = (postID) => {
    navigate(`/c/${postID}`);
  }

  return (
    <div className={classes.homeCommunityCardArea}>
      <h3>{title}</h3>
      <Card elevation={2} className={classes.homeCommunityCard}>
        {data?.map((item, index) => (
          <Link
            key={index}
            color="inherit"
            underline="none"
            className={classes.homeCommunityCardLink}
            onClick={() => {handleLinkClick(item.communityPostId)}}
          >
            <span className={classes.titleName}>{item.title} </span>
            <span className={classes.titleComment}>[{item.replyCount}]</span>
          </Link>
        ))}
      </Card>
    </div>
  );
}

async function HomeCommunityListRequest(boardID) {
  try {
    const response = await apiInstance.get(
      `/api/v1/community/posts/search/${boardID}`,
      {
        params: {
          page: 0,
          size: 5,
          sort: ["createdAt,desc"],
        },
      }
    );
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data)
      return response.data.data.communityPostSearchResponseDtoList;
    }
  } catch (error) {
    //console.log(error.message);
  }
  return [];
}

const dummyData = [
  {
    type: "공모전",
    title: "오늘의 공모전 소식",
    comment: 2,
  },
  {
    type: "asdf",
    title: "gawehgarg",
    comment: 3,
  },
  {
    type: "waerfaew",
    title: "hjkdaskjbgaasdfasdfasdfkre",
    comment: 1,
  },
  {
    type: "asdf",
    title: "gawehgarg",
    comment: 3,
  },
  {
    type: "공모전",
    title: "오늘의 공모전 소식",
    comment: 2,
  },
];
