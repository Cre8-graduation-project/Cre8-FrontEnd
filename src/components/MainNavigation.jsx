import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { RiArticleLine, RiBookmarkLine, RiChat4Line, RiLogoutBoxLine, RiNotification3Line, RiUserLine } from "@remixicon/react";

import classes from "./MainNavigation.module.css";
import { useAuth } from "../provider/authProvider";
import { Toast } from "../components/Toast";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function MainNavigation() {
  const navigate = useNavigate();
  const { token, logout, userID, isLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChatClick = () => {
    navigate("/chat");
  }

  const handleProfile = () => {
    navigate(`/p/${userID}`);
  };
  const handleArticle = () => {
    navigate('/my-post');
  };
  const handleBookmark = () => {
    navigate('/bookmark');
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <header className={classes.header}>
      <Card className={classes.nav}>
        <ul className={classes.list}>
          <li>
            <NavLink to="/" className={classes.homeBtn} end>
              Cre8
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recruit"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              구인
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/job"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              구직
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              커뮤니티
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/test"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              테스트
            </NavLink>
          </li>
        </ul>
        {!isLoggedIn ? (
          <ul className={classes.list}>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                로그인
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? classes.registerBtnActive : classes.registerBtn
                }
              >
                회원가입
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul className={classes.buttonList}>
            <li>
              <IconButton onClick={handleChatClick}>
                <RiChat4Line size={20} className={classes.navIcon} />
              </IconButton>
            </li>
            <li>
              <IconButton>
                <RiNotification3Line size={20} className={classes.navIcon} />
              </IconButton>
            </li>
            <li>
              <IconButton onClick={handleClick}>
                <Avatar sx={{ width: 36, height: 36 }}></Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                disableScrollLock={true}
              >
                <MenuItem sx={{minHeight: "32px"}} onClick={handleProfile}>
                  <ListItemIcon><RiUserLine size={22}/></ListItemIcon>
                  <ListItemText>프로필</ListItemText>
                </MenuItem>
                <MenuItem sx={{minHeight: "32px"}} onClick={handleArticle}>
                  <ListItemIcon><RiArticleLine size={22}/></ListItemIcon>
                  <ListItemText>My 게시글</ListItemText>
                </MenuItem>
                <MenuItem sx={{minHeight: "32px"}} onClick={handleBookmark}>
                  <ListItemIcon><RiBookmarkLine size={22}/></ListItemIcon>
                  <ListItemText>My 북마크</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem sx={{minHeight: "32px"}} onClick={handleLogout}>
                  <ListItemIcon><RiLogoutBoxLine size={22}/></ListItemIcon>
                  <ListItemText>로그아웃</ListItemText>
                </MenuItem>
              </Menu>
            </li>
          </ul>
        )}
      </Card>
    </header>
  );
}

// 로그아웃 요청
async function sendLogoutRequest(token) {
  let url = apiAddress + "/api/v1/auth/logout";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accessToken: token,
    },
    credentials: "include",
  });

  switch (response.status) {
    case 200:
      Toast.success("로그아웃되었습니다.");
      break;
    case 400:
      Toast.error("로그아웃 중 오류가 발생했습니다.");
      break;
    default:
      Toast.error("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}
