import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Divider, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import TitleBar from "../../components/TitleBar";
import {
  JobListCard,
  RecruitListCard,
} from "../../components/Joblist/JobListCard";
import { isEmpty, throttle } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";
import classes from "./MyPost.module.css";

export default function MyPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // Tab Index
  const tabType = searchParams.get("tab") || "recruit";
  // Bookmarked Post Data
  const [myPostData, setMyPostData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  // Page Info
  const [pageSearchObj, setPageSearchObj] = useState({
    page: 0,
    size: 10,
    sort: ["createdAt"],
    direction: "desc",
  });
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchPage = useCallback(
    throttle(() => {
      //console.log("FETCHING!");
      searchMyPostwithKeyword(tabType, pageSearchObj).then((data) => {
        //console.log(data);
        // Update Data
        if (tabType == "recruit") {
          setMyPostData(
            myPostData.concat(data.employerPostSearchResponseDtoList)
          );
        } else if (tabType == "job") {
          setMyPostData(
            myPostData.concat(data.employeePostSearchResponseDtoList)
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
    [pageSearchObj]
  );

  const handleTabChange = (e, newValue) => {
    searchParams.set("tab", newValue);
    navigate(`?${searchParams.toString()}`);
  };

  const handleCardClick = (postID) => {
    navigate(`/${tabType}/${postID}`);
  };

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
    if (isFetching && hasNextPage) fetchPage();
    else if (!hasNextPage) setIsFetching(false);
  }, [isFetching]);

  // Reset Data on Tab Change
  useEffect(() => {
    setMyPostData([]);
    setHasNextPage(true);
    setPageSearchObj({ ...pageSearchObj, page: 0 });
    setIsFetching(true);
  }, [location.search]);

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar backBtnTarget={-1} title="My 게시글" />
      <div className={classes.bookmarkTab}>
        <TabContext value={tabType}>
          <TabList
            onChange={handleTabChange}
            className={classes.bookmarkTabList}
          >
            <Tab value="recruit" label="구인" />
            <Tab label="" icon={<Divider orientation="vertical"/>} sx={{ maxWidth: "1px", minWidth: "1px", padding: "0.8rem 0" }} disabled />
            <Tab value="job" label="구직" />
          </TabList>
          <TabPanel value="recruit" sx={{padding: "0"}}>
            {isEmpty(myPostData) && <p>표시할 내용이 없습니다.</p>}
            {!isEmpty(myPostData) &&
              myPostData.map((item, index) => (
                <RecruitListCard
                  key={index}
                  itemData={item}
                  onClick={() => { handleCardClick(item.employerPostId) }}
                />
              ))}
          </TabPanel>
          <TabPanel value="job" sx={{padding: "0"}}>
            {isEmpty(myPostData) && <p>표시할 내용이 없습니다.</p>}
            {!isEmpty(myPostData) &&
              myPostData.map((item, index) => (
                <JobListCard
                  key={index}
                  itemData={item}
                  onClick={() => { handleCardClick(item.employeePostId) }}
                />
              ))}
          </TabPanel>
        </TabContext>
      </div>
    </Card>
  );
}

// 구직 게시글 검색 함수
async function searchMyPostwithKeyword(
  tabType,
  pageableObj,
  keywordData = null
) {
  let apiAddress;
  if (tabType == "job") {
    apiAddress = "/api/v1/employee-posts/search/my-posts";
  } else if ((tabType = "recruit")) {
    apiAddress = "/api/v1/employer-posts/search/my-posts";
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
    console.error(error.message);
  }
  return { error: true };
}
