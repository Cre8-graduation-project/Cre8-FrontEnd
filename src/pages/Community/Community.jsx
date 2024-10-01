import { useState, useCallback, useEffect } from "react";
import { useNavigate, useRouteLoaderData, useLocation } from "react-router-dom";
import { useTheme, useMediaQuery, Card, Button, Divider } from "@mui/material";

import TitleBar from "../../components/Common/TitleBar";
import CommunityNavBar from "../../components/Community/CommunityNavBar";
import { isEmpty, timeSince, throttle } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";
import classes from "./Community.module.css";
import { useAuth } from "../../provider/authProvider";
import CommunityPostCard from "../../components/Community/CommunityPostCard";

export default function CommunityPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const boardId = searchParams.get("b") || 1;
  const boardName = location.state?.boardName || "자유게시판";
  // Community Post List Data
  const initData = useRouteLoaderData("community-page");
  const [data, setData] = useState({
    postList: initData.communityPostSearchResponseDtoList,
    hasNextPage: initData.hasNextPage,
  });
  // Page Info
  const [pageObj, setPageObj] = useState({
    page: 0,
    size: 10,
    sort: ["createdAt,desc"],
  });
  const [isFetching, setIsFetching] = useState(false);

  const fetchPage = useCallback(
    throttle(() => {
      //console.log("FETCHING!");
      CommunityLoader(boardId, pageObj).then((res) => {
        //console.log(data);
        // Update Data
        setData({
          postList: data.postList.concat(
            res.communityPostSearchResponseDtoList
          ),
          hasNextPage: res.hasNextPage,
        });
        setPageObj({
          ...pageObj,
          page: pageObj.page + 1,
        });
        setIsFetching(false);
      });
    }, 500),
    [boardId, pageObj]
  );

  // Add Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop >= offsetHeight) {
        setIsFetching(true);
      }
    };
    setIsFetching(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Data when Needed
  useEffect(() => {
    if (isFetching && data.hasNextPage) fetchPage();
    else if (!data.hasNextPage) setIsFetching(false);
  }, [isFetching]);

  const handleWriteBtnClick = (e) => {
    e.preventDefault();
    navigate("/c/edit", {
      state: { boardId: boardId, isCreation: true },
    });
  };

  const handlePostClick = (postId) => {
    navigate(`./${postId}`);
  };

  return (
    <div className={classes.communityContent}>
      <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0", flexGrow: "3" }}>
        <TitleBar title={boardName}>
          {isLoggedIn && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleWriteBtnClick}
            >
              게시물 작성
            </Button>
          )}
        </TitleBar>
        <Divider />
        {isFetching && <p>로딩 중</p>}
        {!isFetching && isEmpty(data.postList) && (
          <p>표시할 내용이 없습니다.</p>
        )}
        {!isFetching &&
          !isEmpty(data.postList) &&
          data.postList?.map((item, index) => (
            <CommunityPostCard
              key={`POST_${index}`}
              item={item}
              onClick={() => handlePostClick(item.communityPostId)}
            />
          ))}
      </Card>
      {!matchDownSm && (
        <Card
          sx={{
            borderRadius: "0.7rem",
            margin: "1.3rem 0",
            flexGrow: "1",
            height: "100%",
          }}
        >
          <CommunityNavBar />
        </Card>
      )}
    </div>
  );
}

// 커뮤니티 게시글 목록 데이터 요청 함수
export async function CommunityLoader({
  boardType = 1,
  pageObj = {
    page: 0,
    size: 10,
    sort: ["createdAt,desc"],
  },
}) {
  try {
    const response = await apiInstance.get(
      `/api/v1/community/posts/search/${boardType}`,
      { params: pageObj }
    );
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data)
      return response.data.data;
    }
  } catch (error) {
    //console.log(error.message);
  }
  return [];
}
