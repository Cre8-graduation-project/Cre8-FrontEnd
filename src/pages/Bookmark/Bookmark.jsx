import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Divider, Tab, Card } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import TitleBar from "../../components/Common/TitleBar";
import {
  JobListCard,
  RecruitListCard,
} from "../../components/Joblist/JobListCard";
import { isEmpty, throttle } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";
import classes from "./Bookmark.module.css";
import CommunityPostCard from "../../components/Community/CommunityPostCard";

export default function BookmarkPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // Tab Index
  const tabType = searchParams.get("tab") || "recruit";
  // Bookmarked Post Data
  const [bookmarkedPostData, setBookmarkedPostData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  // Page Info
  const [pageSearchObj, setPageSearchObj] = useState({
    page: 0,
    size: 10,
    sort: ["createdAt,desc"],
  });
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchPage = useCallback(
    throttle(() => {
      searchBookmarkwithKeyword(tabType, pageSearchObj).then((data) => {
        // Update Data
        if (tabType == "recruit") {
          setBookmarkedPostData(
            bookmarkedPostData.concat(data.employerPostSearchResponseDtoList)
          );
        } else if (tabType == "job") {
          setBookmarkedPostData(
            bookmarkedPostData.concat(data.employeePostSearchResponseDtoList)
          );
        } else if (tabType == "community") {
          setBookmarkedPostData(
            bookmarkedPostData.concat(data.communityPostSearchResponseDtoList)
          );
        }
        setPageSearchObj({
          ...pageSearchObj,
          page: pageSearchObj.page + 1,
        });
        setHasNextPage(data.hasNextPage);
        setIsFetching(false);
      });
    }, 500),
    [pageSearchObj, tabType]
  );

  const handleTabChange = (e, newValue) => {
    // Reset Data on Tab Change
    setBookmarkedPostData([]);
    setHasNextPage(true);
    setPageSearchObj({ ...pageSearchObj, page: 0 });
    setIsFetching(true);
    // Change Tab Data and redirect
    searchParams.set("tab", newValue);
    navigate(`?${searchParams.toString()}`);
  };

  const handleCardClick = (postID) => {
    if(tabType != "community") {
      navigate(`/${tabType}/${postID}`);
    } else {
      navigate(`/c/${postID}`);
    }
  };

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

  const TabDivider = () => {
    return (
      <Tab 
        label="" 
        icon={<Divider orientation="vertical"/>} 
        sx={{ maxWidth: "1px", minWidth: "1px", padding: "0.8rem 0" }} 
        disabled 
      />
    );
  };

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar backBtnTarget={-1} title="My 북마크 & 좋아요" />
      <TabContext value={tabType}>
        <TabList
          onChange={handleTabChange}
          className={classes.bookmarkTabList}
        >
          <Tab value="recruit" label="구인" />
          <TabDivider />
          <Tab value="job" label="구직" />
          <TabDivider />
          <Tab value="community" label="커뮤니티" />
        </TabList>
        <TabPanel value="recruit" sx={{padding: "0"}}>
          {!isFetching && isEmpty(bookmarkedPostData) && <p>표시할 내용이 없습니다.</p>}
          {!isEmpty(bookmarkedPostData) &&
            bookmarkedPostData?.map((item, index) => (
              <RecruitListCard
                key={index}
                itemData={item}
                onClick={() => { handleCardClick(item.employerPostId) }}
              />
            ))}
        </TabPanel>
        <TabPanel value="job" sx={{padding: "0"}}>
          {!isFetching && isEmpty(bookmarkedPostData) && <p>표시할 내용이 없습니다.</p>}
          {!isEmpty(bookmarkedPostData) &&
            bookmarkedPostData?.map((item, index) => (
              <JobListCard
                key={index}
                itemData={item}
                onClick={() => { handleCardClick(item.employeePostId) }}
              />
            ))}
        </TabPanel>
        <TabPanel value="community" sx={{padding: "0"}}>
          {!isFetching && isEmpty(bookmarkedPostData) && <p>표시할 내용이 없습니다.</p>}
          {!isEmpty(bookmarkedPostData) &&
            bookmarkedPostData?.map((item, index) => (
              <CommunityPostCard 
                key={index} 
                item={item}
                onClick={() => { handleCardClick(item.communityPostId) }}
              />
            ))}
        </TabPanel>
      </TabContext>
    </Card>
  );
}

// 구직 게시글 검색 함수
async function searchBookmarkwithKeyword(
  tabType,
  pageableObj,
  keywordData = null
) {
  let apiAddress;
  if (tabType == "job") {
    apiAddress = "/api/v1/employee-posts/search/my-bookmark";
  } else if (tabType == "recruit") {
    apiAddress = "/api/v1/employer-posts/search/my-bookmark";
  } else if (tabType == "community") {
    apiAddress = "/api/v1/community/posts/search/like/my-Post";
  }

  // Append Keyword if it exists
  let paramObj = { ...pageableObj };
  if (keywordData != null) {
    paramObj = {
      ...paramObj,
      keyword: keywordData,
    };
  }

  try {
    const response = await apiInstance.get(apiAddress, {
      params: paramObj,
    });
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data)
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    //console.error(error.message);
  }
  return { error: true };
}
