import { useState } from "react";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router-dom";
import {
  useTheme,
  useMediaQuery,
  Card,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import { RiAddFill } from "@remixicon/react";

import TitleBar from "../../components/Common/TitleBar";
import { EditorMenuBar, editorExtensions } from "../../components/Common/Editor";
import { isEmpty } from "../../provider/utilityProvider";
import { Toast } from "../../components/Common/Toast";
import apiInstance from "../../provider/networkProvider";
import classes from "./Community.module.css";

export default function CommunityEditPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(
    location.state?.isCreation == null || location.state?.isCreation
      ? INITIAL_POST_EDIT_VALUE
      : useRouteLoaderData("community-page-edit")
  );
  // Post Content in JSON type
  const [postContent, setPostContent] = useState(
    location.state?.isCreation == null || location.state?.isCreation
      ? ""
      : JSON.parse(data.contents)
  );
  const [imageData, setImageData] = useState({
    imgFile: null,
    imgURL: data?.image || null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    setData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleAddImg = (e) => {
    setIsUploading(true);
    if (e.target.type === "file" && e.target.files && e.target.files[0]) {
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

    if (isEmpty(data.title) || isEmpty(postContent)) {
      Toast.error("입력되지 않은 내용이 있습니다.");
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    if(location.state.isCreation) {
      formData.append("communityBoardId", location.state.boardId);
    } else {
      formData.append("communityPostId", location.state.postId);
    }
    formData.append("title", data.title);
    formData.append("contents", JSON.stringify(postContent));
    if (imageData.imgFile !== null) {
      formData.append("multipartFile", imageData.imgFile);
    }

    communityPostEditAction(formData, location.state.isCreation)
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
    <Card
      className={classes.communityEditCard}
      sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}
    >
      <Backdrop open={isUploading}>
        <CircularProgress />
      </Backdrop>
      <TitleBar title="게시글 작성" backBtnTarget={-1} />
      <div className={classes.communityEditTitleBar}>
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
      </div>
      <div className={classes.communityEditContentArea}>
        <CommunityPostEditor
          postContent={postContent}
          setPostContent={setPostContent}
        />
      </div>
      <div className={classes.communityEditImageArea}>
        <label htmlFor="communityImageUploadBtn">
          {imageData.imgURL == null && <RiAddFill />}
          {imageData.imgURL != null && (
            <img src={imageData.imgURL} alt="postImage" />
          )}
          <input
            id="communityImageUploadBtn"
            style={{ display: "none" }}
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleAddImg}
          />
        </label>
        <p>이미지는 게시글 상단에 노출됩니다.</p>
      </div>
      <div className={classes.communityEditButtonRow}>
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
async function communityPostEditAction(formData, isCreation = true) {
  try {
    const response = await apiInstance({
      method: isCreation ? "post" : "put",
      url: "/api/v1/community/posts",
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
      Toast.error("게시물 수정 도중 오류가 발생했습니다.");
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

// 게시글 에디터
const CommunityPostEditor = ({ postContent, setPostContent }) => {
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
    <div className={classes.editor}>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

// 프로필 데이터 요청 함수
export async function CommunityEditLoader({ request, params }) {
  const cPID = params.communityPostID;

  try {
    const response = await apiInstance.get(`/api/v1/community/posts/${cPID}`);
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data)
      return {
        title: response.data.data.title || "",
        contents: response.data.data.contents || "",
        image: response.data.data.accessUrl || "",
      };
    }
  } catch (error) {
    //console.log(error.message);
  }
  return [];
}

const INITIAL_POST_EDIT_VALUE = {
  title: "",
  contents: "",
  image: "",
};
