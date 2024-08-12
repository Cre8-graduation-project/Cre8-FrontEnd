import { useState, useEffect, useCallback } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Button, Pagination } from "@mui/material";

import TitleBar from "../../components/TitleBar";
import TagSelector from "../../components/Tag/TagSelector";
import TagChildSelector from "../../components/Tag/TagChildSelector";
import JobListSortBar from "../../components/Joblist/JobListSortBar";
import { RecruitListCard } from "../../components/Joblist/JobListCard";
import { tagElementLoader } from "../../components/Tag/TagLoader";
import apiInstance from "../../provider/networkProvider";
import { debounce } from "../../provider/utilityProvider";
import { useAuth } from "../../provider/authProvider";
import classes from "./Recruit.module.css";

export default function RecruitPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  // Tag Data
  const tagData = useRouteLoaderData("recruit-page");
  const [tagElementData, setTagElementData] = useState();
  // User selected tag
  const [selectedTag, setSelectedTag] = useState();
  const [selectedElement, setSelectedElement] = useState(new Set());
  // Recruit Post Data
  const [recruitPostData, setRecruitPostData] = useState({});
  const [recruitSearchObj, setRecruitSearchObj] = useState({});
  const [recruitPageObj, setRecruitPageObj] = useState({ size: 10 });

  // Debounced Search Callback
  const debouncedSearchRecruitPost = useCallback(
    debounce((searchObj, pageObj) => {
      searchRecruitPost(searchObj, pageObj).then((data) => {
        //console.log(data)
        setRecruitPostData(data);
      });
    }, 300),
    []
  );

  //console.log(tagData);
  //console.log(recruitPostData);

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
    setRecruitSearchObj({
      ...recruitSearchObj,
      workFieldId: selectedTag,
    });
  }, [selectedTag]);

  // on Tag Child Change
  useEffect(() => {
    // Update Search Key Object
    if (selectedElement) {
      setRecruitSearchObj({
        ...recruitSearchObj,
        workFieldChildTagId: [...selectedElement],
      });
    }
  }, [selectedElement]);

  // on Search Key and Page Key Change
  useEffect(() => {
    // re-search and fetch Post Data
    debouncedSearchRecruitPost(recruitSearchObj, recruitPageObj);
  }, [recruitSearchObj, recruitPageObj]);

  const onPageChange = (event, value) => {
    setRecruitPageObj({
      ...recruitPageObj,
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
      <TitleBar title="구인">
        {isLoggedIn && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddClick}
          >
            구인 글 작성
          </Button>
        )}
      </TitleBar>
      <div className={classes.recruitTagArea}>
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
      <div className={classes.recruitPostArea}>
        {Object.keys(recruitPostData).length === 0 && <p>불러오는 중</p>}
        {Object.keys(recruitPostData).length !== 0 &&
          recruitPostData.totalCount == 0 && <p>표시할 내용이 없습니다.</p>}
        {Object.keys(recruitPostData).length !== 0 &&
          recruitPostData.totalCount > 0 &&
          recruitPostData.employerPostSearchResponseDtoList.map(
            (item, index) => (
              <RecruitListCard
                key={index}
                itemData={item}
                onClick={() => {
                  handleCardClick(item.employerPostId);
                }}
              />
            )
          )}
      </div>
      <div className={classes.recruitPageArea}>
        <Pagination
          count={recruitPostData.totalPages || 1}
          page={recruitPageObj.page + 1 || 1}
          onChange={onPageChange}
        />
      </div>
    </>
  );
}

// 구인 게시글 검색 함수
async function searchRecruitPost(recruitSearchObj, recruitPageObj) {
  //console.log("Searching!");
  //console.log(recruitSearchObj);
  //console.log(recruitPageObj);

  try {
    const response = await apiInstance.get("/api/v1/employer-posts/search", {
      params: {
        ...recruitSearchObj,
        ...recruitPageObj,
      },
    });
    if (response.status === 200) {
      // 조회 성공
      if (response.data.data == "") {
        // 데이터가 비어있으면 null 반환
        return {};
      } else {
        return response.data.data;
      }
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return {};
}

const dummyData = {
  totalCount: 2,
  employerPostSearchResponseDtoList: [
    {
      employerPostId: 0,
      title: "Test Post 1",
      companyName: "Test Company",
      enrollDurationType: "Duration 1",
      tagNameList: ["Tag1", "Tag2"],
    },
    {
      employerPostId: 1,
      title: "Test Post 2",
      companyName: "테스트 회사",
      enrollDurationType: "Duration 2",
      tagNameList: ["hello?", "yyyyyyy"],
    },
  ],
  totalPages: 1,
};
