import { Card, Grid } from "@mui/material";
import classes from "./HomeComponent.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiInstance from "../../provider/networkProvider";
import TagList from "../Tag/TagList";

export default function HomeRecruitList() {
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    fetchHomeRecruitList().then((res) => {
      setData(res);
      //console.log(data);
    })
  }, [])

  const handleCardClick = (postID) => {
    navigate(`/recruit/${postID}`);
  };

  return (
    <div className={classes.homeCategoryArea}>
      <h3>새로운 크리에이터 구인 공고</h3>
      <Grid container columns={{ xs: 2, sm: 4 }} spacing={{ xs: 2, sm: 2 }}>
        {data && data.employerPostSearchResponseDtoList.map((item, index) => (
          <Grid item key={index} xs={2} sm={2}>
            <Card
              elevation={3}
              className={classes.homeJobPostCard}
              onClick={() => {
                handleCardClick(item.employerPostId);
              }}
            >
              <h3>{item.title}</h3>
              <TagList tagList={item.tagNameList}/>
            </Card>
          </Grid>
        ))}
        {!data && <p>구인 공고를 불러오지 못했습니다.</p>}
      </Grid>
    </div>
  );
}

// 구인 게시글 검색 함수
async function fetchHomeRecruitList() {
  try {
    const response = await apiInstance.get("/api/v1/employer-posts/search", {
      params: {
        size: 4,
      },
    });
    if (response.status === 200) {
      // 조회 성공
      if (response.data.data == "") {
        // 데이터가 비어있으면 null 반환
        return {};
      } else {
        return response.data.data;
      }
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return {};
}
