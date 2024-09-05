import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useRouteLoaderData, useLocation } from "react-router-dom";
import {
  Card,
  Tooltip,
  IconButton,
  Pagination,
  Menu,
  MenuItem,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  RiMoreLine,
  RiPencilLine,
  RiSearchLine,
  RiSearchFill,
} from "@remixicon/react";

import TitleBar from "../../components/TitleBar";
import TagAccordion from "../../components/Tag/TagAccordion";
import ExpTagSelector from "../../components/Tag/ExpTagSelector";
import JobListSortBar from "../../components/Joblist/JobListSortBar";
import { JobListCard } from "../../components/Joblist/JobListCard";
import { RecruitListCard } from "../../components/Joblist/JobListCard";
import apiInstance from "../../provider/networkProvider";
import { debounce } from "../../provider/utilityProvider";
import { useAuth } from "../../provider/authProvider";
import { isEmpty, areArraysEqual } from "../../provider/utilityProvider";
import classes from "./Job.module.css";

export default function JobRecruitListPage({ pageType }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [state, setState] = useState({
    pageIndex: parseInt(searchParams.get("page") || "1", 10),
    selectedTag: location?.state?.tagID ?? "",
    selectedElement: [],
    selectedExpTag: null,
    jobPostData: null,
    jobSearchObj: { workFieldId: location?.state?.tagID ?? "" },
    jobPageObj: { size: 10, sort: ["createdAt,desc"], page: 0 },
    anchorEl: null,
    isSearchBarOpen: false,
    searchKeyword: "",
    isLoading: true,
  });
  const updateState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);
  const updateElement = useCallback((newElement) => {
    setState((prevState) => {
      if (areArraysEqual(prevState.selectedElement, newElement)) {
        return prevState;
      }
      return {
        ...prevState,
        selectedElement: newElement,
      };
    });
  }, []);
  const open = Boolean(state.anchorEl);

  // Debounced Search Callback
  const debouncedSearchJobPost = useCallback(
    debounce((searchObj, pageObj) => {
      searchJobPost(pageType, searchObj, pageObj).then((data) => {
        updateState({
          jobPostData: data,
          isLoading: false,
        });
      });
    }, 300),
    [pageType]
  );
  
  // Debounced Keyword Search Callback
  const debouncedSearchJobPostwithKeyword = useCallback(
    debounce((pageObj) => {
      searchJobPostwithKeyword(pageType, pageObj).then((data) => {
        updateState({
          jobPostData: data,
          isLoading: false,
        });
      });
    }, 300),
    [pageType]
  );

  // Reset Search Objects on Page Change (Job / Recruit)
  useEffect(() => {
    updateState({
      selectedTag: location?.state?.tagID ?? "",
      selectedElement: [],
      selectedExpTag: null,
      jobSearchObj: { workFieldId: location?.state?.tagID ?? "" },
      jobPageObj: { size: 10, sort: ["createdAt,desc"], page: 0 },
    });
  }, [pageType]);

  // on Search Key and Page Key Change
  useEffect(() => {
    if(state.isLoading && !state.isSearchBarOpen) {
      debouncedSearchJobPost(state.jobSearchObj, state.jobPageObj);
    } else if(state.isLoading && state.isSearchBarOpen) {
      debouncedSearchJobPostwithKeyword(state.jobPageObj);
    }
  }, [state.jobSearchObj, state.jobPageObj]);

  // Update Search Object on Page Change
  useEffect(() => {
    updateState({
      jobPageObj: {
        ...state.jobPageObj,
        page: state.pageIndex - 1,
      },
      isLoading: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.pageIndex]);

  const onPageChange = (event, value) => {
    searchParams.set("page", value);
    navigate(`?${searchParams.toString()}`);
    updateState({ pageIndex: value });
  };

  const handleMenuClick = (event) => {
    updateState({ anchorEl: event.currentTarget });
  };
  const handleMenuClose = () => {
    updateState({ anchorEl: null });
  };
  const handleMenuBookmark = () => {
    navigate(`/bookmark?tab=${pageType}`);
  };
  const handleMenuMyPost = () => {
    navigate(`/my-post?tab=${pageType}`);
  };

  const toggleSearchBar = () => {
    updateState({
      isSearchBarOpen: !state.isSearchBarOpen,
    });
  };
  const handleSearchFieldChange = (e) => {
    updateState({ searchKeyword: e.currentTarget.value });
  };
  const handleSearchClick = (e) => {
    e.preventDefault();
    updateState({
      jobPageObj: {
        ...state.jobPageObj,
        keyword: state.searchKeyword,
        page: 0,
      },
      isLoading: true,
    });
  };

  const handleAddClick = () => {
    navigate("./edit", { state: { isCreation: true } });
  };

  const handleCardClick = (postID) => {
    navigate(`./${postID}`);
  };

  const handleTagChange = useCallback(() => {
    updateElement([]);
    updateState({
      jobSearchObj: {
        ...state.jobSearchObj,
        workFieldId: state.selectedTag,
      },
      isLoading: true,
    });
  }, [state.jobSearchObj, state.selectedTag, updateState, updateElement]);

  const handleElementChange = useCallback(() => {
    updateState({
      jobSearchObj: {
        ...state.jobSearchObj,
        workFieldChildTagId: state.selectedElement,
      },
      isLoading: true,
    });
  }, [state.jobSearchObj, state.selectedElement, updateState]);

  const renderJobCards = useMemo(() => {
    if (state.isLoading || isEmpty(state.jobPostData)) {
      return (
        <center>
          <CircularProgress sx={{ padding: "1rem" }} />
        </center>
      );
    }

    if (state.jobPostData?.error) {
      return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
    }

    if (state.jobPostData?.totalCount === 0) {
      return <p>표시할 내용이 없습니다.</p>;
    }

    const CardComponent = pageType === "job" ? JobListCard : RecruitListCard;
    const dataList =
      pageType === "job"
        ? state.jobPostData?.employeePostSearchResponseDtoList
        : state.jobPostData?.employerPostSearchResponseDtoList;

    return dataList?.map((item, index) => (
      <CardComponent
        key={index}
        itemData={item}
        onClick={() =>
          handleCardClick(
            pageType === "job" ? item["employeePostId"] : item["employerPostId"]
          )
        }
      />
    ));
  }, [state.jobPostData, state.isLoading, pageType]);

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar title={pageType == "job" ? "구직" : "구인"}>
        <>
          <Tooltip
            title="검색"
            placement="top"
            slotProps={appbarTooltipOffsetProp}
          >
            <IconButton
              color={state.isSearchBarOpen ? "primary" : ""}
              onClick={toggleSearchBar}
            >
              {state.isSearchBarOpen ? <RiSearchFill /> : <RiSearchLine />}
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
                anchorEl={state.anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                disableScrollLock={true}
              >
                <MenuItem
                  sx={{ minHeight: "32px" }}
                  onClick={handleMenuBookmark}
                >
                  내 북마크 조회
                </MenuItem>
                <Divider />
                <MenuItem sx={{ minHeight: "32px" }} onClick={handleMenuMyPost}>
                  내 작성글 조회
                </MenuItem>
              </Menu>
            </>
          )}
        </>
      </TitleBar>
      {state.isSearchBarOpen && (
        <div className={classes.jobSearchArea}>
          <TextField
            size="small"
            value={state.searchKeyword}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
      {!state.isSearchBarOpen && (
        <div className={classes.jobTagArea}>
          <TagAccordion
            selectedTag={state.selectedTag}
            selectedElement={state.selectedElement}
            setTag={(tag) => updateState({ selectedTag: tag })}
            setElement={updateElement}
            onTagChange={handleTagChange}
            onElementChange={handleElementChange}
          />
          <ExpTagSelector
            selectedExp={state.selectedExpTag}
            setExpTag={updateState}
            updateObj={(obj) =>
              updateState({
                jobSearchObj: { ...state.jobSearchObj, ...obj },
                isLoading: true,
              })
            }
          />
        </div>
      )}
      <JobListSortBar
        pageType={pageType}
        pageObj={state.jobPageObj}
        setObj={(obj) => {
          updateState({ jobPageObj: obj, isLoading: true });
        }}
      />
      <div className={classes.jobPostArea}>{renderJobCards}</div>
      <div className={classes.jobPageArea}>
        <Pagination
          count={state.jobPostData?.totalPages || 1}
          page={state.jobPageObj.page + 1 || 1}
          onChange={onPageChange}
        />
      </div>
    </Card>
  );
}

// 구직 게시글 검색 함수
async function searchJobPost(pageType, jobSearchObj, jobPageObj) {
  //console.log("NORMAL SEARCH");
  //console.log(jobSearchObj);
  //console.log(jobPageObj);
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
async function searchJobPostwithKeyword(pageType, jobPageObj) {
  //console.log("Keyword SEARCH");
  //console.log(jobPageObj);
  let apiAddress;
  if (pageType == "job") {
    apiAddress = "/api/v1/employee-posts/search/keyword";
  } else if ((pageType = "recruit")) {
    apiAddress = "/api/v1/employer-posts/search/keyword";
  }

  try {
    const response = await apiInstance.get(apiAddress, {
      params: jobPageObj,
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
