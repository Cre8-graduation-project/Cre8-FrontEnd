import { useState, useEffect, useCallback } from "react";
import {
  useNavigate,
  useRouteLoaderData,
  useLocation,
} from "react-router-dom";
import {
  Tooltip,
  IconButton,
  Pagination,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  RiMoreLine,
  RiPencilLine,
  RiSearchLine,
  RiSearchFill,
} from "@remixicon/react";

import TitleBar from "../../components/TitleBar";
import TagSelector from "../../components/Tag/TagSelector";
import TagChildSelector from "../../components/Tag/TagChildSelector";
import JobListSortBar from "../../components/Joblist/JobListSortBar";
import { JobListCard } from "../../components/Joblist/JobListCard";
import { RecruitListCard } from "../../components/Joblist/JobListCard";
import { tagElementLoader } from "../../components/Tag/TagLoader";
import apiInstance from "../../provider/networkProvider";
import { debounce } from "../../provider/utilityProvider";
import { useAuth } from "../../provider/authProvider";
import { isEmpty } from "../../provider/utilityProvider";
import classes from "./Job.module.css";

export default function JobRecruitListPage({ pageType }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // Page Data
  const pageIndex = searchParams.get("page") || 1;
  // Tag Data
  const tagData = useRouteLoaderData(
    pageType == "job" ? "job-page" : "recruit-page"
  );
  const [tagElementData, setTagElementData] = useState();
  // User selected tag
  const requestedTagID = location?.state?.tagID ?? "";
  const [selectedTag, setSelectedTag] = useState(requestedTagID);
  const [selectedElement, setSelectedElement] = useState(new Set());
  // Job Post Data
  const [jobPostData, setJobPostData] = useState();
  const [jobSearchObj, setJobSearchObj] = useState({});
  const [jobPageObj, setJobPageObj] = useState({
    size: 10,
    direction: "desc",
    sort: ["createdAt"],
    page: 0,
  });
  // Menu Button
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // Search Data
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  // isLoading State
  const [isLoading, setIsLoading] = useState(false);

  // Debounced Search Callback
  const debouncedSearchJobPost = useCallback(
    debounce((searchObj, pageObj) => {
      searchJobPost(pageType, searchObj, pageObj).then((data) => {
        //console.log(data)
        setJobPostData(data);
        setIsLoading(false);
      });
    }, 300),
    [pageType]
  );

  // on Main Tag Change
  useEffect(() => {
    // Update Tag Child
    if (selectedTag) {
      tagElementLoader(selectedTag).then((res) => {
        setTagElementData(res);
      });
    } else {
      setTagElementData();
    }
    // Update Search Key Object
    setJobSearchObj({
      ...jobSearchObj,
      workFieldId: selectedTag,
    });
  }, [selectedTag]);

  // on Tag Child Change
  useEffect(() => {
    // Update Search Key Object
    if (selectedElement) {
      setJobSearchObj({
        ...jobSearchObj,
        workFieldChildTagId: [...selectedElement],
      });
    }
  }, [selectedElement]);

  // on Search Key and Page Key Change
  useEffect(() => {
    setIsLoading(true);
    // re-search and fetch Post Data
    debouncedSearchJobPost(jobSearchObj, jobPageObj);
  }, [jobSearchObj, jobPageObj]);

  // Reset Search Objects on Update
  useEffect(() => {
    setJobSearchObj({});
    setJobPageObj({
      size: 10,
      direction: "desc",
      sort: ["createdAt"],
      page: 0,
    })
  }, [pageType]);

  // Update Search Object on Page Change
  useEffect(() => {
    setJobPageObj({
      ...jobPageObj,
      page: pageIndex - 1,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.search]);

  const onPageChange = (event, value) => {
    searchParams.set("page", value);
    navigate(`?${searchParams.toString()}`);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuBookmark = () => {
    navigate(`/bookmark?tab=${pageType}`);
  }
  const handleMenuMyPost = () => {
    navigate(`/my-post?tab=${pageType}`);
  }

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };
  const handleSearchFieldChange = (e) => {
    setSearchData(e.currentTarget.value);
  };
  const handleSearchClick = (e) => {
    e.preventDefault();
    // reset Search Object
    //setJobSearchObj({});
    // send keyword search request
    searchJobPostwithKeyword(pageType, searchData, jobPageObj).then((data) => {
      setJobPostData(() => {
        let totalCount;
        if(pageType == 'job') {
          totalCount = Object.keys(data.employeePostSearchResponseDtoList).length;
        } else {
          totalCount = Object.keys(data.employerPostSearchResponseDtoList).length;
        }

        return {
          ...data,
          // TODO: FIX TEMP SOLUTION
          totalCount: totalCount,
        };
      });
    });
  };

  const handleAddClick = () => {
    navigate("./edit", { state: { isCreation: true } });
  };

  const handleCardClick = (postID) => {
    navigate(`./${postID}`);
  };

  return (
    <>
      <TitleBar title={pageType == "job" ? "구직" : "구인"}>
        <>
          <Tooltip
            title="검색"
            placement="top"
            slotProps={appbarTooltipOffsetProp}
          >
            <IconButton
              color={isSearchBarOpen ? "primary" : ""}
              onClick={toggleSearchBar}
            >
              {isSearchBarOpen ? <RiSearchFill /> : <RiSearchLine />}
            </IconButton>
          </Tooltip>
          {isLoggedIn && (
            <>
              <Tooltip
                title={pageType == "job" ? "구직 글 작성" : "구인 글 작성"}
                placement="top"
                slotProps={appbarTooltipOffsetProp}
              >
                <IconButton onClick={handleAddClick}>
                  <RiPencilLine />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="더 보기"
                placement="top"
                slotProps={appbarTooltipOffsetProp}
              >
                <IconButton onClick={handleMenuClick}>
                  <RiMoreLine />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                disableScrollLock={true}
              >
                <MenuItem sx={{minHeight: "32px"}} onClick={handleMenuBookmark}>내 북마크 조회</MenuItem>
                <Divider />
                <MenuItem sx={{minHeight: "32px"}} onClick={handleMenuMyPost}>내 작성글 조회</MenuItem>
              </Menu>
            </>
          )}
        </>
      </TitleBar>
      {isSearchBarOpen && (
        <div className={classes.jobSearchArea}>
          <TextField
            size="small"
            value={searchData}
            fullWidth
            onKeyDown={(e) => {
              if(e.key === "Enter") {
                handleSearchClick(e);
              }
            }}
            onChange={handleSearchFieldChange}
          />
          <IconButton onClick={handleSearchClick}>
            <RiSearchLine />
          </IconButton>
        </div>
      )}
      {!isSearchBarOpen && (
        <div className={classes.jobTagArea}>
          <TagSelector
            title="작업 분야"
            tagList={tagData}
            selectedTag={selectedTag}
            setTag={setSelectedTag}
            toggle={true}
          />
          {tagElementData &&
            tagElementData.map((subTag, index) => (
              <TagChildSelector
                key={index}
                title={subTag.subCategoryName}
                tagList={subTag.workFieldChildTagResponseDtoList}
                selectedElement={selectedElement}
                setElement={setSelectedElement}
              />
            ))}
        </div>
      )}
      <JobListSortBar setObj={setJobPageObj} />
      <div className={classes.jobPostArea}>
        {isLoading && <Backdrop open={isLoading}>
          <CircularProgress  sx={{ color: "#fff" }}/>  
        </Backdrop>}
        {isEmpty(jobPostData) && <p>불러오는 중</p>}
        {!isEmpty(jobPostData) && jobPostData.error && (
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        )}
        {!isEmpty(jobPostData) && jobPostData.totalCount == 0 && (
          <p>표시할 내용이 없습니다.</p>
        )}
        {!isEmpty(jobPostData) &&
          jobPostData.totalCount > 0 &&
          pageType == "job" &&
          jobPostData?.employeePostSearchResponseDtoList?.map((item, index) => (
            <JobListCard
              key={index}
              itemData={item}
              onClick={() => {
                handleCardClick(item.employeePostId);
              }}
            />
          ))}
        {!isEmpty(jobPostData) &&
          jobPostData.totalCount > 0 &&
          pageType == "recruit" &&
          jobPostData?.employerPostSearchResponseDtoList?.map((item, index) => (
            <RecruitListCard
              key={index}
              itemData={item}
              onClick={() => {
                handleCardClick(item.employerPostId);
              }}
            />
          ))}
      </div>
      <div className={classes.jobPageArea}>
        <Pagination
          count={jobPostData?.totalPages || 1}
          page={jobPageObj.page + 1 || 1}
          onChange={onPageChange}
        />
      </div>
    </>
  );
}

// 구직 게시글 검색 함수
async function searchJobPost(pageType, jobSearchObj, jobPageObj) {
  let apiAddress;
  if (pageType == "job") {
    apiAddress = "/api/v1/employee-posts/search";
  } else if (pageType == "recruit") {
    apiAddress = "/api/v1/employer-posts/search";
  }

  try {
    const response = await apiInstance.get(apiAddress, {
      params: {
        ...jobSearchObj,
        ...jobPageObj,
      },
    });
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data);
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return { error: true };
}

// 구직 게시글 검색 함수
async function searchJobPostwithKeyword(pageType, keywordData, jobPageObj) {
  let apiAddress;
  if (pageType == "job") {
    apiAddress = "/api/v1/employee-posts/search/keyword";
  } else if (pageType = "recruit") {
    apiAddress = "/api/v1/employer-posts/search/keyword";
  }

  try {
    const response = await apiInstance.get(apiAddress, {
      params: {
        keyword: keywordData,
        ...jobPageObj,
      },
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

const appbarTooltipOffsetProp = {
  popper: {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -10],
        },
      },
    ],
  },
};
