import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";
import {
  ImageList,
  ImageListItem,
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
  Card,
} from "@mui/material";
import { RiAddFill, RiDeleteBinLine } from "@remixicon/react";
import { useEditor, EditorContent } from "@tiptap/react";

import TitleBar from "../../components/TitleBar";
import TagAccordion from "../../components/Tag/TagAccordion";
import TagSelector from "../../components/Tag/TagSelector";
import TagChildSelector from "../../components/Tag/TagChildSelector";
import { tagElementLoader, tagLoader } from "../../components/Tag/TagLoader";
import { removePortfolioPost } from "../../components/Portfolio/PortfolioGrid";
import { EditorMenuBar, editorExtensions } from "../../components/Editor";
import { Toast } from "../../components/Toast";
import { useAuth } from "../../provider/authProvider";
import apiInstance from "../../provider/networkProvider";
import classes from "./Portfolio.module.css";

export default function PortfolioEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = useAuth();
  const [data, setData] = useState(useRouteLoaderData("portfolio-page-edit"));
  // Portfolio Description in JSON type
  const [ptfDesc, setPtfDesc] = useState(JSON.parse(data.description) || "");
  // Uploaded Image Array
  const [uploadedImgArray, setUploadedImgArray] = useState([]);
  // Deleted Image Array
  const [deletedImageList, setDeletedImageList] = useState([]);
  // Tag Data
  const [tagData, setTagData] = useState();
  const [tagElementData, setTagElementData] = useState();
  // User selected tag
  const [selectedTag, setSelectedTag] = useState();
  const [selectedElement, setSelectedElement] = useState([]);
  // Uploading Status
  const [isUploading, setIsUploading] = useState(false);

  // Tag Loader logic
  useEffect(() => {
    // on Initial Load...
    // Load Main Tag
    if (!tagData) {
      tagLoader().then((res) => {
        setTagData(res);
      });
    }
  }, []);
  useEffect(() => {
    // After Main Tag Data is loaded...
    // load portfolio data as initial value
    if (tagData && data.tagName) {
      const savedTagName = data.tagName[0];
      tagData.map((item) => {
        if (savedTagName == item.name) {
          setSelectedTag(item.workFieldTagId);
        }
      });
    }
  }, [tagData]);
  useEffect(() => {
    // on Main Tag Change...
    // Load Tag Child
    if (selectedTag) {
      tagElementLoader(selectedTag).then((res) => {
        setTagElementData(res);
      });
    }
  }, [selectedTag]);
  useEffect(() => {
    // After Tag Element loaded...
    // load portfolio data as initial value
    const tempData = [...data.tagName];
    const tempElement = [];
    // Remove first tag (non-element)
    tempData.shift();
    if (tagElementData && tempData) {
      tagElementData.map((elementItem) => {
        elementItem.workFieldChildTagResponseDtoList.map((childItem) => {
          if (tempData[0] == childItem.name) {
            tempElement.push(childItem.workFieldChildTagId);
            tempData.shift();
          }
        });
      });
      if (tempData.length == 0) {
        setSelectedElement(tempElement);
      }
    }
  }, [tagElementData]);

  const handleDeleteImg = (index) => {
    // If delete target is newly added image
    if(data.portfolioImageResponseDtoList[index].portfolioImageId == null) {
      const newImgIndex = index + uploadedImgArray.length - data.portfolioImageResponseDtoList.length;
      setUploadedImgArray((prevArray) => {
        prevArray.splice(newImgIndex, 1);
        return prevArray;
      });
    } 
    // If delete target is already uploaded image
    else {
      setDeletedImageList([
        ...deletedImageList,
        data.portfolioImageResponseDtoList[index].portfolioImageId
      ]);
    }

    setData((prevData) => {
      const newArray = [...prevData.portfolioImageResponseDtoList];
      newArray.splice(index, 1);
      return {
        ...prevData,
        portfolioImageResponseDtoList: newArray,
      };
    });
  };

  const handleAddImg = (e) => {
    setIsUploading(true);
    if (e.target.type === "file" && e.target.files && e.target.files[0]) {
      // Fetch Preview Image
      const uploadedImg = e.target.files[0];
      const imgURL = window.URL.createObjectURL(uploadedImg);
      setUploadedImgArray((prevArray) => [
        ...prevArray, 
        uploadedImg,
      ]);
      setData((prevData) => {
        return {
          ...prevData,
          portfolioImageResponseDtoList: [
            ...prevData.portfolioImageResponseDtoList, 
            {
              portfolioImageId: null,
              portfolioImageAccessUrl: imgURL,
            },
          ],
        };
      });
    }
    setIsUploading(false);
  };

  const handleCancelEdit = () => {
    if (location.state?.isCreation) {
      removePortfolioPost(params.portfolioID);
    }
    navigate("../");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("portfolioId", params.portfolioID);
    if (selectedTag) {
      formData.append("workFieldId", selectedTag);
    }
    selectedElement.forEach((elementID) => {
      if (elementID) {
        formData.append("workFieldChildTagId", elementID);
      }
    });
    uploadedImgArray.forEach((file) => {
      if (file) {
        formData.append("multipartFileList", file);
      }
    });
    deletedImageList.forEach((imageID) => {
      if (imageID) {
        formData.append("deletePortfolioImageList", imageID);
      }
    })
    if(deletedImageList.length == 0) formData.append("deletePortfolioImageList", "");
    formData.append("description", JSON.stringify(ptfDesc));

    portfolioEditAction(formData)
      .then((res) => {
        // Success
        if (res && res.status === 200) {
          navigate(`/p/${userID}`, { relative: "path" });
        }
      })
      .catch((error) => {
        // TODO: error handling
      });
  };

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }} className={classes.ptfEditPage}>
      <Backdrop open={isUploading}>
        <CircularProgress />
      </Backdrop>
      <TitleBar
        title={
          location.state.isCreation ? "포트폴리오 작성" : "포트폴리오 수정"
        }
      />
      <div className={classes.editTagArea}>
        <h3>태그 설정</h3>
        <p>작업물을 가장 잘 설명하는 태그를 선택해주세요.</p>
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
      <div className={classes.editImageArea}>
        <h3>이미지 첨부</h3>
        <ImageList cols={5} gap={10} sx={{ padding: "0.4rem 1.3rem" }}>
          {data.portfolioImageResponseDtoList.map((item, index) => (
            <ImageListItem key={`IMG_${index}`}>
              <img src={`${item.portfolioImageAccessUrl}`} alt={`IMG_${index}`} />
              <IconButton
                className={classes.deleteButton}
                onClick={() => {
                  handleDeleteImg(index);
                }}
              >
                <RiDeleteBinLine />
              </IconButton>
            </ImageListItem>
          ))}
          <label htmlFor="ptfImgUploadBtn">
            <ImageListItem key={"imgAddBtn"} className={classes.imgAddBtn}>
              <RiAddFill />
              <input
                id="ptfImgUploadBtn"
                style={{ display: "none" }}
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleAddImg}
              />
            </ImageListItem>
          </label>
        </ImageList>
      </div>
      <div className={classes.editDescArea}>
        <h3>작업물 설명</h3>
        <PortfolioEditor ptfDesc={ptfDesc} setPtfDesc={setPtfDesc} />
      </div>
      <div className={classes.editBtnArea}>
        <Button 
          variant="outlined"
          onClick={handleCancelEdit}
          className={classes.cancelEditBtn}
        >
          취소
        </Button>
        <Button 
          variant="contained"
          onClick={handleSaveEdit}
        >
          저장
        </Button>
      </div>
    </Card>
  );
}

// 포트폴리오 데이터 수정 요청 함수
async function portfolioEditAction(formData) {
  try {
    const response = await apiInstance({
      method: "put",
      url: "/api/v1/portfolios",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      // 저장 성공
      Toast.success("변경사항들을 저장했습니다.");
      return response;
    }
  } catch (error) {
    // 로그인 실패
    if (error.response && error.response.status === 400) {
      Toast.error("인증과정에서 오류가 발생했습니다.");
    } else if (error.response && error.response.status === 404) {
      Toast.error("태그를 다루는 도중 오류가 발생했습니다.");
    } else {
      Toast.error("알 수 없는 오류가 발생했습니다.");
    }
  }
  return null;
}

// 포트폴리오 에디터
const PortfolioEditor = ({ ptfDesc, setPtfDesc }) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: ptfDesc
      ? {
          type: "doc",
          content: ptfDesc,
        }
      : "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const data = json.content;
      setPtfDesc(data);
    },
    editorProps: {
      attributes: {
        style: "min-height: 17rem;",
      },
    },
  });

  return (
    <div className={classes.editor}>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
