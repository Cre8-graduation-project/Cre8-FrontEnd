import { useEffect, useState } from "react";
import { useNavigate, useLocation, useRouteLoaderData } from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  TextField,
  Divider,
  Button,
  Grid,
  Card,
} from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import { RiAddFill } from "@remixicon/react";

import TitleBar from "../../components/Common/TitleBar";
import TagSelector from "../../components/Tag/TagSelector";
import SubTagSelector from "../../components/Tag/SubTagSelector";
import TagChildSelector from "../../components/Tag/TagChildSelector";
import { TagElementLoader, TagLoader } from "../../components/Tag/TagLoader";
import apiInstance from "../../provider/networkProvider";
import { Toast } from "../../components/Common/Toast";
import { EditorMenuBar, editorExtensions } from "../../components/Editor/Editor";
import classes from "./Job.module.css";
import { isEmpty, isFileSizeUnderLimit } from "../../provider/utilityProvider";

export default function JobEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(
    location.state?.isCreation == null || location.state?.isCreation
      ? INITIAL_JOB_VALUE
      : useRouteLoaderData("job-page-edit")
  );
  const [imageData, setImageData] = useState({
    imgFile: null,
    imgURL: null,
  });
  // Job Description in JSON type
  const [postContent, setPostContent] = useState(
    location.state?.isCreation == null || location.state?.isCreation
      ? ""
      : JSON.parse(data.contents)
  );
  // Tag Data
  const [tagData, setTagData] = useState();
  const [tagElementData, setTagElementData] = useState();
  const payType = ["작업물 건 당 지급", "작업물 분 당 지급", "월급", "기타"];
  // User selected tag
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedElement, setSelectedElement] = useState([]);
  // Uploading Status
  const [isUploading, setIsUploading] = useState(false);

  // Tag Loader logic
  useEffect(() => {
    // on Initial Load...
    // Load Main Tag
    if (!tagData) {
      //console.log("Loading Main Tag");
      TagLoader().then((res) => {
        setTagData(res);
      });
    }
  }, []);
  useEffect(() => {
    // After Main Tag Data is loaded...
    // load recruit data as initial value
    if (tagData && data?.tagPostResponseDto?.workFieldTagName) {
      tagData.map((item) => {
        if (data.tagPostResponseDto.workFieldTagName == item.name) {
          setSelectedTag(item.workFieldTagId);
        }
      });
    }
  }, [tagData]);
  useEffect(() => {
    // on Main Tag Change...
    // Load Tag Child
    if (selectedTag) {
      //console.log("Loading Tag Child");
      TagElementLoader(selectedTag).then((res) => {
        setTagElementData(res);
        //console.log(tagElementData);
      });
      setSelectedElement([]);
    }
  }, [selectedTag]);
  useEffect(() => {
    // After Tag Element loaded...
    // load post data as initial value
    if (data?.tagPostResponseDto?.subCategoryWithChildTagResponseDtoList?.length > 0) {
      let tempData = [];
      data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
        (subItem) => {
          tempData = [...tempData, ...subItem.childTagName];
        }
      );
      const tempElement = [];
      //
      if (tagElementData && tempData) {
        while(tempData.length > 0) {
          tagElementData.map((elementItem) => {
            elementItem.workFieldChildTagResponseDtoList.map((childItem) => {
              if (tempData[0] == childItem.name) {
                tempElement.push(childItem.workFieldChildTagId);
                tempData.shift();
              }
            });
          });
        }
        if (tempData.length == 0) {
          setSelectedElement(tempElement);
        }
      }
    }
  }, [tagElementData]);

  const handleInputChange = (e) => {
    setData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleAddImg = (e) => {
    //console.log("ADD IMAGE!!");
    setIsUploading(true);
    if (e.target.type === "file" && e.target.files && e.target.files[0]) {
      if (!isFileSizeUnderLimit(e.target.files[0])) {
        Toast.error("1MB 이하의 이미지만 사용할 수 있습니다.");
      }
      // Fetch Preview Image
      const uploadedImg = e.target.files[0];
      const uploadedImgURL = window.URL.createObjectURL(uploadedImg);
      setImageData({
        imgFile: uploadedImg,
        imgURL: uploadedImgURL,
      });
    }
    setIsUploading(false);
  }

  const handleCancelEdit = () => {
    navigate(-1);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    if (
      isEmpty(data.title) ||
      isEmpty(data.contact) ||
      isEmpty(postContent)
    ) {
      Toast.error("입력되지 않은 내용이 있습니다.");
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    if(!location.state?.isCreation) {
      formData.append("employeePostId", data.employeePostId)
    };
    formData.append("title", data.title);
    formData.append("contact", data.contact);
    formData.append("contents", JSON.stringify(postContent));
    if(!isEmpty(selectedTag)) {
      formData.append("workFieldId", selectedTag);
    }
    if(!isEmpty(selectedElement)) {
      selectedElement.forEach((element) => {
        if(element) {
          formData.append("workFieldChildTagId", element)
        };
      })
    } else {
      formData.append("workFieldChildTagId", "") 
    }
    if(!isEmpty(data.paymentMethod)) {
      formData.append("paymentMethod", data.paymentMethod);
    }
    if(!isEmpty(data.paymentAmount)) {
      formData.append("paymentAmount", data.paymentAmount);
    }
    if(!isEmpty(data.careerYear)) {
      formData.append("careerYear", data.careerYear);
    }
    if(imageData.imgFile !== null) {
      formData.append("multipartFile", imageData.imgFile);
    }

    jobPostEditAction(formData, location.state.isCreation)
      .then((res) => {
        // Success
        if (res && (res.status === 200 || res.status === 201)) {
          navigate(-1);
        }
      })
      .catch((error) => {
        // TODO: error handling
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <Backdrop open={isUploading}>
        <CircularProgress />
      </Backdrop>
      <TitleBar
        title={
          location.state.isCreation ? "구직 게시글 작성" : "구직 게시글 수정"
        }
      ></TitleBar>
      <div className={classes.editTitleArea}>
        <h3>게시글 정보 *</h3>
        <TextField
          size="small"
          fullWidth
          label="제목"
          variant="outlined"
          name="title"
          value={data.title}
          onChange={handleInputChange}
          required
        />
        <TextField
          size="small"
          fullWidth
          label="연락처 (이메일 / 전화번호)"
          variant="outlined"
          name="contact"
          value={data.contact}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={classes.editTagArea}>
        <h3>구인 태그 설정</h3>
        <TagSelector
          title="작업 분야"
          tagList={tagData}
          selectedTag={selectedTag}
          setTag={setSelectedTag}
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
          <Grid item xs={2} sm={15} sx={{ paddingTop: "0.6rem !important" }}>
            <h3>급여 정보</h3>
            <div className={classes.jobPostInfoAreaRow}>
              <p>지급 방식</p>
              <SubTagSelector
                tagList={payType}
                selectedTag={data.paymentMethod}
                setTag={(input) => {
                  setData({
                    ...data,
                    paymentMethod: input,
                  });
                }}
              />
            </div>
            <div className={classes.jobPostInfoAreaRow}>
              <p>희망 급여</p>
              <input
                type="number"
                name="paymentAmount"
                value={data.paymentAmount}
                onChange={handleInputChange}
              />
              <b>원</b>
            </div>
          </Grid>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mr: "-1px", paddingLeft: "16px" }}
          />
          <Grid item xs={2} sm={15} sx={{ paddingTop: "0.6rem !important" }}>
            <h3>추가 정보</h3>
            <div className={classes.jobPostInfoAreaRow}>
              <p>작업 경력</p>
              <input
                type="number"
                name="careerYear"
                value={data.careerYear}
                onChange={handleInputChange}
              />
              <b>년</b>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className={classes.editDescArea}>
        <h3>설명 *</h3>
        <RecPostEditor
          postContent={postContent}
          setPostContent={setPostContent}
        />
      </div>
      <div className={classes.editThumbnailArea}>
        <h3>대표 이미지</h3>
        <div className={classes.editThumbnailParagraph}>
          <label htmlFor="jobThumbnailUploadBtn">
            {imageData.imgURL == null && <RiAddFill />}
            {imageData.imgURL != null && (
              <img src={imageData.imgURL} alt="postThumbnail" />
            )}
            <input
              id="jobThumbnailUploadBtn"
              style={{ display: "none" }}
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleAddImg}
            />
          </label>
          <p>대표 이미지는 게시글 목록에 노출됩니다.</p>
        </div>
      </div>
      <div className={classes.editBtnArea}>
        <Button variant="outlined" onClick={handleCancelEdit}>
          취소
        </Button>
        <Button variant="contained" onClick={handleSaveEdit}>
          저장
        </Button>
      </div>
    </Card>
  );
}

// 포트폴리오 데이터 수정 요청 함수
async function jobPostEditAction(formData, isCreation = true) {
  try {
    const response = await apiInstance({
      method: isCreation ? "post" : "put",
      url: "/api/v1/employee/posts",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      // 저장 성공
      Toast.success("변경사항들을 저장했습니다.");
      return response;
    } else if (response.status === 201) {
      // 생성 성공
      Toast.success("성공적으로 게시글을 업로드했습니다.");
      return response;
    }
  } catch (error) {
    // 로그인 실패
    if (error.response && error.response.status === 400) {
      Toast.error("태그 데이터를 다루는 도중 오류가 발생했습니다.");
    } else if (error.response && error.response.status === 404) {
      Toast.error("잘못된 데이터가 입력되었습니다.");
    } else if (error.response && error.response.status === 413) {
      Toast.error("이미지의 용량이 너무 큽니다.");
    } else {
      Toast.error("알 수 없는 오류가 발생했습니다.");
    }
  }
  return null;
}

// 포트폴리오 에디터
const RecPostEditor = ({ postContent, setPostContent }) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: postContent
      ? {
          type: "doc",
          content: postContent,
        }
      : "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const data = json.content;
      setPostContent(data);
    },
    editorProps: {
      attributes: {
        style: "min-height: 17rem;",
      },
    },
  });

  return (
    <div className={classes.editDescAreaEditor}>
      <EditorMenuBar editor={editor} enableGemini={true} />
      <EditorContent editor={editor} style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}/>
    </div>
  );
};

const INITIAL_JOB_VALUE = {
  title: "",
  name: "",
  sex: "",
  birthYear: "",
  tagPostResponseDto: {
    workFieldTagName: "",
    subCategoryWithChildTagResponseDtoList: [],
  },
  paymentMethod: "",
  paymentAmount: "",
  careerYear: "",
  contents: "",
  contact: "",
};
