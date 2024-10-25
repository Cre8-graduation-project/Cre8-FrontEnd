import { useState, useCallback, useEffect } from "react";
import { useNavigate, useRouteLoaderData, useLocation } from "react-router-dom";
import { useTheme, useMediaQuery, Card, Button, Divider } from "@mui/material";

import TitleBar from "../../components/Common/TitleBar";
import CommunityNavBar from "../../components/Community/CommunityNavBar";
import { isEmpty, throttle } from "../../provider/utilityProvider";
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
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  // Page Info
  const [pageObj, setPageObj] = useState({
    size: 10,
    lastPostId: null,
  });
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchPage = useCallback(
    throttle(() => {
      searchCommunityPost(boardId, pageObj).then((res) => {
        if (res?.communityPostSearchResponseDtoList?.length) {
          setData(prevData => [...prevData, ...res.communityPostSearchResponseDtoList]);
          setPageObj(prev => ({
            ...prev,
            lastPostId: res.communityPostSearchResponseDtoList[res.communityPostSearchResponseDtoList.length - 1].communityPostId,
          }));
          setHasNextPage(res.hasNextPage);
        }
        setIsFetching(false);
      });
    }, 500),
    [pageObj, boardId]
  );

  // Add Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop >= offsetHeight) {
        setIsFetching(hasNextPage);
      }
    };
    setIsFetching(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Data when Needed
  useEffect(() => {
    if (isFetching && hasNextPage) {
      fetchPage();
    } else if (!hasNextPage) {
      setIsFetching(false);
    }
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
        {!isEmpty(data) && data?.map((item, index) => (
          <CommunityPostCard
            key={`POST_${index}`}
            item={item}
            onClick={() => handlePostClick(item.communityPostId)}
          />
        ))}
        {isFetching && <p>로딩 중</p>}
        {!isFetching && isEmpty(data) && (
          <p>표시할 내용이 없습니다.</p>
        )}
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
export async function searchCommunityPost(
  boardType = 1,
  pageObj = {
    size: 10,
  },
) {
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
