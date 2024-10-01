import {
  useNavigate,
  useRouteLoaderData,
  useLocation,
} from "react-router-dom";
import { Avatar, Link, Tab, Button, Divider, Card } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RiGlobalLine, RiTwitterXLine, RiYoutubeLine } from "@remixicon/react";
import classes from "./Profile.module.css";

import { ReadOnlyEditor } from "../../components/Common/Editor";
import { PortfolioGrid } from "../../components/Portfolio/PortfolioGrid";
import { useAuth } from "../../provider/authProvider";
import apiInstance from "../../provider/networkProvider";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const data = useRouteLoaderData("profile-page");
  const { memberCode } = useAuth();
  // Profile Data
  const profileData = {
    uProfileImage: data.accessUrl || "",
    uNickName: data.userNickName || "",
    uLinkYoutube: data.youtubeLink || "",
    uLinkTwitter: data.twitterLink || "",
    uLinkWebpage: data.personalLink || "",
    uAbout: data.personalStatement || "",
    uMemberCode: data.memberCode,
  };
  // Tab Index
  const tabIndex = searchParams.get("tab") || "1";

  const handleEditClick = () => {
    navigate("edit");
  };

  const handleTabChange = (e, newValue) => {
    searchParams.set("tab", newValue);
    navigate(`?${searchParams.toString()}`);
  };

  // !!! 프로필 수정 버튼 = 임시 조치
  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <div className={classes.content}>
        <Avatar
          alt={profileData.uNickName}
          src={profileData.uProfileImage}
          sx={{ 
            width: "20dvw", height: "20dvw",
            minWidth: "4rem", minHeight: "4rem",
            maxWidth: "7rem", maxHeight: "7rem" 
          }}
        />
        <ul className={classes.contextButtonList}>
          <li>
            <h1>{profileData.uNickName}</h1>
          </li>
          <li>
            {data.memberCode == memberCode && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEditClick}
              >
                프로필 수정
              </Button>
            )}
          </li>
        </ul>
        <div>
          {profileData.uLinkTwitter && (
            <ul className={classes.list}>
              <li>
                <RiTwitterXLine size={22} className={classes.profileIcon} />
              </li>
              <li>
                <Link
                  href={profileData.uLinkTwitter}
                  color="inherit"
                  rel="noopener noreferrer"
                  sx={{marginBottom: "0.1rem"}}
                >
                  {profileData.uLinkTwitter}
                </Link>
              </li>
            </ul>
          )}
          {profileData.uLinkYoutube && (
            <ul className={classes.list}>
              <li>
                <RiYoutubeLine size={22} className={classes.profileIcon} />
              </li>
              <li>
                <Link
                  href={profileData.uLinkYoutube}
                  color="inherit"
                  rel="noopener noreferrer"
                  sx={{marginBottom: "0.1rem"}}
                >
                  {profileData.uLinkYoutube}
                </Link>
              </li>
            </ul>
          )}
          {profileData.uLinkWebpage && (
            <ul className={classes.list}>
              <li>
                <RiGlobalLine size={22} className={classes.profileIcon} />
              </li>
              <li>
                <Link
                  href={profileData.uLinkWebpage}
                  color="inherit"
                  rel="noopener noreferrer"
                  sx={{marginBottom: "0.1rem"}}
                >
                  {profileData.uLinkWebpage}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className={classes.tab}>
        <TabContext value={tabIndex}>
          <TabList onChange={handleTabChange} className={classes.tabList}>
            <Tab value="1" label="자기소개" />
            <Tab label="" icon={<Divider orientation="vertical"/>} sx={{ maxWidth: "1px", minWidth: "1px", padding: "0.8rem 0" }} disabled />
            <Tab value="2" label="포트폴리오" />
          </TabList>
          <TabPanel value="1" sx={{ padding: "0.5rem 1.3rem", height: "80%" }}>
            <ReadOnlyEditor content={profileData.uAbout} />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "1.3rem" }}>
            <PortfolioGrid memberCode={profileData.uMemberCode} />
          </TabPanel>
        </TabContext>
      </div>
    </Card>
  );
}

// 프로필 데이터 요청 함수
export async function ProfileLoader({ request, params }) {
  const uID = params.userID;

  try {
    const codeResponse = await apiInstance.get("/api/v1/members/pk", {
      params: { loginId: uID },
    });

    // code 요청 성공
    if (codeResponse.status === 200) {
      const memberCode = codeResponse.data.data;

      // code 기반 데이터 요청
      try {
        const dataResponse = await apiInstance.get(
          `/api/v1/${memberCode}/profile`
        );

        // 프로필 데이터 로드 성공
        if (dataResponse.status === 200) {
          const profileData = {
            ...dataResponse.data.data,
            memberCode: memberCode,
          };
          return profileData;
        }
      } catch (error) {
        //console.log(error.message);
        return null;
      }
    }
  } catch (error) {
    //console.log(error.message);
    return null;
  }
}
