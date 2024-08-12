import {
  useNavigate,
  useRouteLoaderData,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Avatar, Tab, IconButton, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RiGlobalLine, RiTwitterXLine, RiYoutubeLine } from "@remixicon/react";

import { useAuth } from "../../provider/authProvider";
import apiInstance from "../../provider/networkProvider"
import { EditorMenuBar, editorExtensions } from "../../components/Editor";
import { PortfolioGrid } from "../../components/Portfolio/PortfolioGrid";
import { Toast } from "../../components/Toast";
import classes from "./Profile.module.css";

export default function ProfileEditPage() {
  const data = useRouteLoaderData("profile-page-edit");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { memberCode } = useAuth();
  // Tab Index
  const tabIndex = searchParams.get("tab") || "1";
  // Profile Data
  const [profileData, setProfileData] = useState({
    uProfileImage: data.accessUrl || "",
    uNickName: data.userNickName || "",
    uLinkYoutube: data.youtubeLink || "",
    uLinkTwitter: data.twitterLink || "",
    uLinkWebpage: data.personalLink || "",
    uMemberCode: data.memberCode,
  });
  // Profile Description in JSON type
  const [profileAbout, setProfileAbout] = useState(
    JSON.parse(data.personalStatement) || ""
  );
  // Uploaded Profile Image
  const [uploadedPFP, setUploadedPFP] = useState(null);

  const handleSaveClick = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (uploadedPFP) {
      formData.append("multipartFile", uploadedPFP);
    }
    if (profileData.uNickName != data.userNickName) {
      formData.append("userNickName", profileData.uNickName);
    }
    formData.append("youtubeLink", getExternalLink(profileData.uLinkYoutube));
    formData.append("twitterLink", getExternalLink(profileData.uLinkTwitter));
    formData.append("personalLink", getExternalLink(profileData.uLinkWebpage));
    formData.append("personalStatement", JSON.stringify(profileAbout));

    profileEditAction(formData).then((res) => {
      // Success
      if (res && res.status === 200) {
        navigate("..");
      }
      // TODO: error handling
    });
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      // Fetch Preview Image
      if (!e.target.files) return;
      const userImg = e.target.files[0];
      const imgURL = window.URL.createObjectURL(userImg);
      setUploadedPFP(userImg);
      setProfileData((prevData) => {
        return {
          ...prevData,
          uProfileImage: imgURL,
        };
      });
    } else {
      setProfileData((prevData) => {
        return {
          ...prevData,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const handleTabChange = (e, newValue) => {
    searchParams.set("tab", newValue);
    navigate(`?${searchParams.toString()}`);
  };

  // !!! 프로필 수정 완료 버튼 = 임시 조치
  return (
    <>
      <div className={classes.content}>
        <IconButton
          component="label"
          sx={{ width: "7rem", height: "7rem" }}
          className={classes.avatarButton}
          onChange={handleChange}
        >
          <Avatar
            alt={profileData.uNickName}
            src={profileData.uProfileImage}
            sx={{ width: "7rem", height: "7rem" }}
          />
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/jpeg, image/png"
          />
        </IconButton>
        <ul className={classes.contextButtonList}>
          <li>
            <input
                id="uNickName"
                name="uNickName"
                type="text"
                className={classes.nicknameInput}
                value={profileData.uNickName || ""}
                onChange={handleChange}
              />
          </li>
          <li>
            {data.memberCode == memberCode && (
              <Button 
                type="submit" 
                onClick={handleSaveClick}
                variant="contained"
                color="secondary"
              >
                저장
              </Button>
            )}
          </li>
        </ul>
        <div>
          <ul className={classes.list}>
            <li>
              <RiTwitterXLine size={22} className={classes.profileIcon} />
            </li>
            <li>
              <input
                id="uLinkTwitter"
                name="uLinkTwitter"
                type="url"
                value={profileData.uLinkTwitter || ""}
                onChange={handleChange}
              />
            </li>
          </ul>
          <ul className={classes.list}>
            <li>
              <RiYoutubeLine size={22} className={classes.profileIcon} />
            </li>
            <li>
              <input
                id="uLinkYoutube"
                name="uLinkYoutube"
                type="url"
                value={profileData.uLinkYoutube || ""}
                onChange={handleChange}
              />
            </li>
          </ul>
          <ul className={classes.list}>
            <li>
              <RiGlobalLine size={22} className={classes.profileIcon} />
            </li>
            <li>
              <input
                id="uLinkWebpage"
                name="uLinkWebpage"
                type="url"
                value={profileData.uLinkWebpage || ""}
                onChange={handleChange}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className={classes.tab}>
        <TabContext value={tabIndex}>
          <TabList onChange={handleTabChange} className={classes.tabList}>
            <Tab value="1" label="자기소개" />
            <Tab value="2" label="포트폴리오" />
          </TabList>
          <TabPanel value="1" sx={{ padding: 0 }}>
            <ProfileEditor
              profileAbout={profileAbout}
              setProfileAbout={setProfileAbout}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "1.3rem" }}>
            <PortfolioGrid memberCode={data.memberCode} isEditing={true} />
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
}

// 프로필 에디터
const ProfileEditor = ({ profileAbout, setProfileAbout }) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: profileAbout
      ? {
          type: "doc",
          content: profileAbout,
        }
      : "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const data = json.content;
      setProfileAbout(data);
    },
  });

  return (
    <>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

// 프로필 데이터 수정 요청 함수
async function profileEditAction(formData) {
  /*
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  */
  try {
    const response = await apiInstance({
      method: "put",
      url: "/api/v1/profiles", 
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status === 200) {
      // 저장 성공
      Toast.success("변경사항들을 저장했습니다.");
      return response;
    }
  } catch (error) {
    // 로그인 실패
    console.log(error.message);
    if (error.response && error.response.status === 400) {
      Toast.error("이미 사용 중인 닉네임입니다.");
    }
    else if (error.response && error.response.status === 401) {
      Toast.error("인증과정에서 오류가 발생했습니다.");
    } 
    else {
      Toast.error("알 수 없는 오류가 발생했습니다.");
    }
  } 
  return null;
}

// 링크 가공 함수
function getExternalLink(link) {
  if (link == "") {
    return "";
  }
  const pattern = /^(https?:\/\/)/;
  if (!pattern.test(link)) {
    return `https://${link}`;
  }
  return link;
}