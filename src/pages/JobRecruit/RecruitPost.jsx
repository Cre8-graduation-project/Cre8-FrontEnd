import { useState, useEffect } from "react";
import { useNavigate, useMatch, useRouteLoaderData } from "react-router-dom";
import { Divider, Chip, Fab, Grid, Tooltip, Card } from "@mui/material";
import { RiChat1Fill, RiStarFill, RiStarLine, RiPencilLine, RiDeleteBinLine } from "@remixicon/react";

import PageContent from "../../components/Common/PageContent";
import TitleBar from "../../components/Common/TitleBar";
import TagList from "../../components/Tag/TagList";
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import { Toast } from "../../components/Common/Toast";
import { ReadOnlyEditor } from "../../components/Common/Editor";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import classes from "./Job.module.css";

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
  // Delete Post Dialog State
  const [isDelDialogOpen, setIsDelDialogOpen] = useState(false);

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
  const handleDeleteClick = (e) => {
    setIsDelDialogOpen(true);
  }
  const handleDeleteDialogClose = () => {
    setIsDelDialogOpen(false);
  }
  const handleBookmarkClick = () => {
    setBookmarkBtnState(!bookmarkBtnState);
    RecruitAddBookmarkRequest(match.params.lastPart).then((status) => {
      if(status != 200) {
        Toast.error("북마크에 추가하는 과정에서 오류가 발생했습니다.");
        setBookmarkBtnState(!bookmarkBtnState);
      }
    })
  }

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar backBtnTarget={-1} title="구인 게시글" />
      {!data ? (
        <PageContent>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.jobPostTitleArea}>
            <h2>{data.title}</h2>
            <h3>{data.companyName}</h3>
            <h4>{data.contact}</h4>
          </div>
          <div className={classes.jobTagListArea}>
            <TagList tagList={tagDataList} />
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
              <Grid item xs={2} sm={15} className={classes.jobPostInfoBox}>
                <h3>모집 정보</h3>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>급여</p>
                  <Chip label={data.paymentMethod} size="small" />
                  <b>{data.paymentAmount}원</b>
                </div>
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
              <Grid item xs={2} sm={15} className={classes.jobPostInfoBox}>
                <h3>모집 조건</h3>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>모집 인원</p>
                  <b>{data.numberOfEmployee}명</b>
                </div>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>모집 기간</p>
                  <b>{data.enrollDurationType}</b>
                  {data.enrollDurationType == "마감일 지정" && (
                    <b>[{data.deadLine}]</b>
                  )}
                </div>
                <div className={classes.jobPostInfoAreaRow}>
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
          <div className={classes.jobPostDescArea}>
            <ReadOnlyEditor content={data.contents} />
            <Tooltip title={!isLoggedIn ? "채팅을 시작하려면 로그인하세요." : ""} placement="top" >
              <div className={classes.jobPostFABParent}>
                <div className={classes.jobPostFAB}>
                  {data.writerId == memberCode && <>
                    <Fab
                      color="secondary"
                      variant="extended"
                      sx={{ gap: "0.5rem" }}
                      disabled={!isLoggedIn}
                      onClick={handleEditClick}
                    >
                      <RiPencilLine/>
                      게시글 수정
                    </Fab>
                    <Fab
                      size="medium"
                      sx={{ gap: "0.5rem" }}
                      disabled={!isLoggedIn}
                      onClick={handleDeleteClick}
                    >
                      <RiDeleteBinLine />
                    </Fab>
                  </>}
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
                    {bookmarkBtnState ? <RiStarFill color="#F9A602"/> : <RiStarLine />}
                  </Fab>
                </div>
              </div>
            </Tooltip>
          </div>
        </>
      )}
      <DeleteDialog 
        isOpen={isDelDialogOpen} 
        onClose={handleDeleteDialogClose} 
        onCancel={handleDeleteDialogClose} 
        deleteAPIURL={`/api/v1/employer/posts/${match.params.lastPart}`} 
      />
    </Card>
  );
}

// 구인 게시글 데이터 요청 함수
export async function RecruitPostLoader({ request, params }) {
  const rpID = params.recruitPostID;
  try {
    const response = await apiInstance.get(`/api/v1/employer/posts/${rpID}`);
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    //console.error(error.message);
  }
  return null;
}

// 구인 게시글 북마크 추가 요청 함수
async function RecruitAddBookmarkRequest(postId) {
  try {
    const response = await apiInstance.post(`/api/v1/bookmark/employer-post/${postId}`);
    // 추가 성공
    return response.status;
  } catch (error) {
    // 추가 실패
    //console.error(error.message);
  }
  return 0;
}