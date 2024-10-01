import { Card, Grid } from "@mui/material";
import classes from "./HomeComponent.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiInstance from "../../provider/networkProvider";
import TagList from "../Tag/TagList";
import { isEmpty } from "../../provider/utilityProvider";
import { errorImage } from "../../assets/images/imageProvider";

export default function HomeJobRecruitList({dataType = "job"}) {
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    fetchHomeJobRecruitList(dataType).then((res) => {
      setData(res);
    });
  }, []);

  const handleCardClick = (postID) => {
    navigate(`/${dataType}/${postID}`);
  };

  return (
    <div className={classes.homePostArea}>
      {dataType == "job" && <h3>새로운 크리에이터 구직 공고</h3>}
      {dataType == "recruit" && <h3>새로운 크리에이터 구인 공고</h3>}
      <Grid container columns={{ xs: 2, sm: 6 }} spacing={{ xs: 2, sm: 2 }}>
        {!isEmpty(data) &&
          data?.map((item, index) => (
            <Grid item key={index} xs={2} sm={2}>
              <Card
                elevation={2}
                className={classes.homeJobPostCard}
                onClick={() => {
                  if(dataType == "job") {
                    handleCardClick(item.employeePostId);
                  } else if (dataType == "recruit") {
                    handleCardClick(item.employerPostId);
                  }
                }}
              > 
                <img src={item.accessUrl || errorImage} alt={item.title}/>
                <div>
                  <h3>{item.title}</h3>
                  <TagList tagList={item.tagNameList} />
                </div>
              </Card>
            </Grid>
          ))}
      </Grid>
      {isEmpty(data) && <p>구인 공고를 불러오지 못했습니다.</p>}
    </div>
  );
}

// 구인 게시글 검색 함수
async function fetchHomeJobRecruitList(dataType) {
  let address;
  if (dataType == "job") {
    address = "/api/v1/employee-posts/search";
  } else if ((dataType = "recruit")) {
    address = "/api/v1/employer-posts/search";
  }

  try {
    const response = await apiInstance.get(address, {
      params: {
        size: 6,
        sort: ["createdAt,desc"],
      },
    });
    if (response.status === 200) {
      // 조회 성공
      if (response.data.data == "") {
        // 데이터가 비어있으면 null 반환
        return [];
      } else {
        if (dataType == "job") {
          return response.data.data.employeePostSearchResponseDtoList;
        } else if ((dataType = "recruit")) {
          return response.data.data.employerPostSearchResponseDtoList;
        }
      }
    }
  } catch (error) {
    // 조회 실패
  }
  return [];
}
