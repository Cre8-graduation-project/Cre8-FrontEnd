import { useState, useEffect } from "react";
import { useNavigate, useMatch, useRouteLoaderData } from "react-router-dom";
import { Divider, Chip, Fab, Grid, Tooltip } from "@mui/material";
import { RiChat1Fill, RiStarFill, RiStarLine, RiPencilLine } from "@remixicon/react";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../../components/Toast";
import { ReadOnlyEditor } from "../../components/Editor";
import classes from "./Recruit.module.css";

export default function RecruitPostPage() {
  const data = useRouteLoaderData("recruitPost-page");
  const match = useMatch('/recruit/:lastPart');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const memberCode = localStorage.getItem("memberCode");
  // Tag List
  const [tagDataList, setTagDataList] = useState([]);
  // Bookmark Button State
  const [bookmarkBtnState, setBookmarkBtnState] = useState(data.bookMarked || false);

  useEffect(() => {
    let tempList = [data.tagPostResponseDto.workFieldTagName];
    data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
      (item) => {
        tempList = [...tempList, ...item.childTagName];
      }
    );
    setTagDataList(tempList);
  }, []);

  const handleChatClick = (e) => {
    navigate('/chat', { state: { chatQuery: {
      targetCode: data.writerId,
      targetNickName: data.writerNickName,
    }}})
  }
  const handleEditClick = (e) => {
    navigate(`/recruit/edit/${match.params.lastPart}`, { 
      state: { isCreation: false }
    })
  }
  const handleBookmarkClick = () => {
    setBookmarkBtnState(!bookmarkBtnState);
    recruitAddBookmarkRequest(match.params.lastPart).then((status) => {
      if(status != 200) {
        Toast.error("북마크에 추가하는 과정에서 오류가 발생했습니다.");
        setBookmarkBtnState(!bookmarkBtnState);
      }
    })
  }

  return (
    <>
      <TitleBar backBtnTarget={-1} title="구인 게시글" />
      {!data ? (
        <PageContent>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.recPostTitleArea}>
            <h2>{data.title}</h2>
            <h3>{data.companyName}</h3>
            <h4>{data.contact}</h4>
            <TagList tagList={tagDataList} />
          </div>
          <div className={classes.recPostInfoArea}>
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
                <h3>모집 정보</h3>
                <div className={classes.recPostInfoAreaRow}>
                  <p>급여</p>
                  <Chip label={data.paymentMethod} size="small" />
                  <b>{data.paymentAmount}원</b>
                </div>
                {data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
                  (item, itemIndex) => (
                    <div key={itemIndex} className={classes.recPostInfoAreaRow}>
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
                <h3>모집 조건</h3>
                <div className={classes.recPostInfoAreaRow}>
                  <p>모집 인원</p>
                  <b>{data.numberOfEmployee}명</b>
                </div>
                <div className={classes.recPostInfoAreaRow}>
                  <p>모집 기간</p>
                  <b>{data.enrollDurationType}</b>
                  {data.enrollDurationType == "마감일 지정" && (
                    <b>[{data.deadLine}]</b>
                  )}
                </div>
                <div className={classes.recPostInfoAreaRow}>
                  <p>요구 경력</p>
                  <b>
                    {data.hopeCareerYear == 0 || data.hopeCareerYear == null
                      ? "경력 무관"
                      : `${data.hopeCareerYear}년`}
                  </b>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.recPostDescArea}>
            <ReadOnlyEditor content={data.contents} />
          </div>
          <Tooltip title={!isLoggedIn ? "채팅을 시작하려면 로그인하세요." : ""} placement="top" >
            <div className={classes.recPostFAB}>
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

// 구인 게시글 데이터 요청 함수
export async function recruitPostLoader({ request, params }) {
  const rpID = params.recruitPostID;
  try {
    const response = await apiInstance.get(`/api/v1/employer/posts/${rpID}`);
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

// 구인 게시글 북마크 추가 요청 함수
export async function recruitAddBookmarkRequest(postId) {
  try {
    const response = await apiInstance.post(`/api/v1/bookmark/employer-post/${postId}`);
    // 추가 성공
    return response.status;
  } catch (error) {
    // 추가 실패
    console.error(error.message);
  }
  return 0;
}