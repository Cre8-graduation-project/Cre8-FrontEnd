import { useState, useEffect, useCallback } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Button, Pagination } from "@mui/material";

import TitleBar from "../../components/TitleBar";
import TagSelector from "../../components/Tag/TagSelector";
import TagChildSelector from "../../components/Tag/TagChildSelector";
import JobListSortBar from "../../components/Joblist/JobListSortBar";
import { JobListCard } from "../../components/Joblist/JobListCard";
import { tagElementLoader } from "../../components/Tag/TagLoader";
import apiInstance from "../../provider/networkProvider";
import { debounce } from "../../provider/utilityProvider";
import { useAuth } from "../../provider/authProvider";
import classes from "./Job.module.css";

export default function JobPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  // Tag Data
  const tagData = useRouteLoaderData("job-page");
  const [tagElementData, setTagElementData] = useState();
  // User selected tag
  const [selectedTag, setSelectedTag] = useState();
  const [selectedElement, setSelectedElement] = useState(new Set());
  // Job Post Data
  const [jobPostData, setJobPostData] = useState({});
  const [jobSearchObj, setJobSearchObj] = useState({});
  const [jobPageObj, setJobPageObj] = useState({ size: 10 });

  // Debounced Search Callback
  const debouncedSearchJobPost = useCallback(
    debounce((searchObj, pageObj) => {
      searchJobPost(searchObj, pageObj).then((data) => {
        //console.log(data)
        setJobPostData(data);
      });
    }, 300),
    []
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
    // re-search and fetch Post Data
    debouncedSearchJobPost(jobSearchObj, jobPageObj);
  }, [jobSearchObj, jobPageObj]);

  const onPageChange = (event, value) => {
    setJobPageObj({
      ...jobPageObj,
      page: value - 1,
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
      <TitleBar title="구직">
        {isLoggedIn && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddClick}
          >
            구직 글 작성
          </Button>
        )}
      </TitleBar>
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
      <JobListSortBar />
      <div className={classes.jobPostArea}>
        {Object.keys(jobPostData).length === 0 && <p>불러오는 중</p>}
        {Object.keys(jobPostData).length !== 0 &&
          jobPostData.totalCount == 0 && <p>표시할 내용이 없습니다.</p>}
        {Object.keys(jobPostData).length !== 0 &&
          jobPostData.totalCount > 0 &&
          jobPostData.employeePostSearchResponseDtoList.map(
            (item, index) => (
              <JobListCard
                key={index}
                itemData={item}
                onClick={() => {
                  handleCardClick(item.employeePostId);
                }}
              />
            )
          )}
      </div>
      <div className={classes.jobPageArea}>
        <Pagination
          count={jobPostData.totalPages || 1}
          page={jobPageObj.page + 1 || 1}
          onChange={onPageChange}
        />
      </div>
    </>
  );
}

// 구직 게시글 검색 함수
async function searchJobPost(jobSearchObj, jobPageObj) {
  try {
    const response = await apiInstance.get("/api/v1/employee-posts/search", {
      params: {
        ...jobSearchObj,
        ...jobPageObj,
      },
    });
    if (response.status === 200) {
      // 조회 성공
      if (response.data.data == "") {
        // 데이터가 비어있으면 null 반환
        return {};
      } else {
        //console.log(response.data.data)
        return response.data.data;
      }
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return {};
}