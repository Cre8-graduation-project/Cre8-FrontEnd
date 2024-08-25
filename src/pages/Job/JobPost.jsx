import { useState, useEffect } from "react";
import { useNavigate, useMatch, useRouteLoaderData } from "react-router-dom";
import {
  Divider,
  ImageList,
  ImageListItem,
  Chip,
  Fab,
  Grid,
  Tooltip,
} from "@mui/material";
import { RiChat1Fill, RiStarFill, RiStarLine, RiPencilLine } from "@remixicon/react";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../../components/Toast";
import { ReadOnlyEditor } from "../../components/Editor";
import { isEmpty } from "../../provider/utilityProvider";
import classes from "./Job.module.css";

export default function JobPostPage() {
  const data = useRouteLoaderData("jobPost-page");
  const match = useMatch('/job/:lastPart');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const memberCode = localStorage.getItem("memberCode");
  //console.log(data);
  //const data = dummyPageData;
  // Tag List
  const [tagDataList, setTagDataList] = useState([]);
  // Bookmark Button State
  const [bookmarkBtnState, setBookmarkBtnState] = useState(!isEmpty(data.bookMarked) ? data.bookMarked : false);

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

  const handleChatClick = () => {
    navigate('/chat', { state: { chatQuery: {
      targetCode: data.writerId,
      targetNickName: data.writerNickName,
    }}})
  }
  const handleEditClick = (e) => {
    navigate(`/job/edit/${match.params.lastPart}`, { 
      state: { isCreation: false }
    })
  }
  const handleBookmarkClick = () => {
    setBookmarkBtnState(!bookmarkBtnState);
    jobAddBookmarkRequest(match.params.lastPart).then((status) => {
      if(status != 200) {
        Toast.error("북마크에 추가하는 과정에서 오류가 발생했습니다.");
        setBookmarkBtnState(!bookmarkBtnState);
      }
    })
  }

  return (
    <>
      <TitleBar backBtnTarget={-1} title="구직 게시글" />
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
            <h4>{data.contact}</h4>
            <TagList tagList={tagDataList} />
          </div>
          <div className={classes.jobPostPtfArea}>
            <h3>작성자 포트폴리오</h3>
            <ImageList cols={3} gap={10}>
              {data.portfolioSimpleResponseDtoList.length > 0 &&
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
              {data.portfolioSimpleResponseDtoList.length == 0 && "표시할 내용이 없습니다."}
            </ImageList>
          </div>
          <div className={classes.jobPostInfoArea}>
            <Grid
              container
              columns={{ xs: 2, sm: 31 }}
              spacing={{ xs: 2, sm: 2 }}
              sx={{
                marginTop: "0.7rem !important",
              }}
              justifyContent="space-between"
            >
              <Grid item xs={2} sm={15} sx={{paddingTop: "0.6rem !important"}}>
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
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mr: "-1px", paddingLeft: "16px" }}
              />
              <Grid item xs={2} sm={15} sx={{paddingTop: "0.6rem !important"}}>
                <h3>작성자 정보</h3>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>희망 급여</p>
                  <Chip label={data.paymentMethod} size="small" />
                  <b>{data.paymentAmount}원</b>
                </div>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>작업 경력</p>
                  <b>{data.careerYear}년</b>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.jobPostDescArea}>
            <ReadOnlyEditor content={data.contents} />
          </div>
          <Tooltip title={!isLoggedIn ? "해당 기능들을 사용하려면 로그인하세요." : ""} placement="top">
            <div className={classes.jobPostFAB}>
              {data.writerId == memberCode && <Fab
                color="secondary"
                variant="extended"
                sx={{ gap: "0.5rem" }}
                disabled={!isLoggedIn}
                onClick={handleEditClick}
              >
                <RiPencilLine/>
                게시글 수정
              </Fab>}
              {data.writerId != memberCode && <Fab
                color="primary"
                variant="extended"
                sx={{ gap: "0.5rem" }}
                disabled={!isLoggedIn}
                onClick={handleChatClick}
              >
                <RiChat1Fill/>
                채팅 시작하기
              </Fab>}
              <Fab
                size="medium"
                sx={{ gap: "0.5rem" }}
                disabled={!isLoggedIn}
                onClick={handleBookmarkClick}
              >
                {bookmarkBtnState ? <RiStarFill /> : <RiStarLine />}
              </Fab>
            </div>
          </Tooltip>
        </>
      )}
    </>
  );
}

// 구직 게시글 데이터 요청 함수
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

// 구직 게시글 북마크 추가 요청 함수
export async function jobAddBookmarkRequest(postId) {
  try {
    const response = await apiInstance.post(`/api/v1/bookmark/employee-post/${postId}`);
    // 추가 성공
    return response.status;
  } catch (error) {
    // 추가 실패
    console.error(error.message);
  }
  return 0;
}