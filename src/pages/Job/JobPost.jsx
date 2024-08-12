import { useState, useEffect } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Divider, ImageList, ImageListItem, Chip, Fab } from "@mui/material";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { ReadOnlyEditor } from "../../components/Editor";
import classes from "./Job.module.css";

export default function JobPostPage() {
  const data = useRouteLoaderData("jobPost-page");
  const navigate = useNavigate();
  //console.log(data);
  //const data = dummyPageData;
  // Tag List
  const [tagDataList, setTagDataList] = useState([]);

  useEffect(() => {
    let tempList = [data.tagPostResponseDto.workFieldTagName];
    data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
      (item) => {
        tempList = [...tempList, ...item.childTagName];
      }
    );
    setTagDataList(tempList);
  }, []);

  const handleImgClick = (e, portfolioID) => {
    navigate(`./${portfolioID}`);
  };

  return (
    <>
      <TitleBar backBtnTarget={"../"} title="구직 게시글" />
      {!data ? (
        <PageContent>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.jobPostTitleArea}>
            <h2>{data.title}</h2>
            <h3>
              {data.name.replace(/..$/, "**")} | {data.sex} | {data.birthYear}
              년생
            </h3>
            <TagList tagList={tagDataList} />
          </div>
          <div className={classes.jobPostPtfArea}>
            <h3>작성자 포트폴리오</h3>
            <ImageList cols={3} gap={10}>
              {data.portfolioSimpleResponseDtoList &&
                data.portfolioSimpleResponseDtoList.map((item) => (
                  <ImageListItem
                    key={item.id}
                    className={classes.jobPortfolioThumbnail}
                  >
                    <img
                      src={`${item.accessUrl}`}
                      alt={item.id}
                      onClick={(e) => {
                        handleImgClick(e, item.id);
                      }}
                    />
                  </ImageListItem>
                ))}
            </ImageList>
          </div>
          <div className={classes.jobPostInfoArea}>
            <div className={classes.jobPostInfoAreaBox}>
              <h3>역량</h3>
              {data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
                (item, itemIndex) => (
                  <div key={itemIndex} className={classes.jobPostInfoAreaRow}>
                    <p>{item.subCategoryName}</p>
                    <ul>
                      {item.childTagName.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Chip label={child} size="small" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={classes.jobPostInfoAreaBox}>
              <h3>작성자 정보</h3>
              <div className={classes.jobPostInfoAreaRow}>
                <p>희망 급여</p>
                <Chip label={data.paymentMethod} size="small" />
                <b>{data.paymentAmount}</b>
              </div>
              <div className={classes.jobPostInfoAreaRow}>
                <p>작업 경력</p>
                <b>{data.careerYear}</b>
              </div>
            </div>
          </div>
          <div className={classes.jobPostDescArea}>
            <ReadOnlyEditor content={JSON.parse(data.contents)} />
          </div>
          <Fab
            color="primary"
            variant="extended"
            sx={{
              position: "fixed",
              bottom: "1.3rem",
              right: "1.3rem",
              "&:hover": { color: "common.white" },
            }}
          >
            채팅 시작하기
          </Fab>
        </>
      )}
    </>
  );
}

// 포트폴리오 데이터 요청 함수
export async function jobPostLoader({ request, params }) {
  const rpID = params.jobPostID;
  try {
    const response = await apiInstance.get(`/api/v1/employee/posts/${rpID}`);
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return null;
}
