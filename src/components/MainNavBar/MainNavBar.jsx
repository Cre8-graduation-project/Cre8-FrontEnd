import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useTheme,
  useMediaQuery,
  Card,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";
import {
  RiChat4Line,
  RiMenu2Line,
  RiNotification3Line,
  RiBardFill,
} from "@remixicon/react";

import MainNavBarDrawer from "./MainNavBarDrawer";
import MainNavBarMenu from "./MainNavBarMenu";
import MainNavBarNotiMenu from "./MainNavBarNotiMenu";
import classes from "./MainNavBar.module.css";
import { useAuth } from "../../provider/authProvider";
import { useNotifications } from "../../provider/notificationProvider";

export default function MainNavBar() {
  const navigate = useNavigate();
  const { userPFP, isLoggedIn } = useAuth();
  const { hasUnreadChat, hasUnreadNotifications, setHasUnreadChat } =
    useNotifications();
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const open = Boolean(anchorEl);
  const openNoti = Boolean(anchorElNoti);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotiMenuClick = (event) => {
    setAnchorElNoti(event.currentTarget);
  };
  const handleNotiMenuClose = () => {
    setAnchorElNoti(null);
  };

  const navList = [
    { name: "구인", link: "/recruit" },
    { name: "구직", link: "/job" },
    { name: "커뮤니티", link: "/c" },
    {
      name: "추천",
      link: "/recommend",
      icon: (
        <RiBardFill
          size={18}
          style={{ marginLeft: "0.3rem", marginTop: "0.2rem" }}
        />
      ),
    },
  ];

  return (
    <>
      {matchDownSm && (
        <MainNavBarDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
      <header className={classes.header}>
        <Card
          className={
            matchDownSm ? `${classes.nav} ${classes.navSm}` : classes.nav
          }
        >
          {matchDownSm ? (
            <div className={classes.navLogoSm}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ padding: "0.7rem" }}
              >
                <RiMenu2Line />
              </IconButton>
              <NavLink to="/" className={classes.homeBtn} end>
                Cre8
              </NavLink>
            </div>
          ) : (
            <ul className={classes.list}>
              <li>
                <NavLink to="/" className={classes.homeBtn} end>
                  Cre8
                </NavLink>
              </li>
              {navList.map((item, index) => (
                <li key={`NAV_LIST_${index}`}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    {item.name}
                    {item.icon}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
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
                <IconButton
                  onClick={() => {
                    navigate("/chat");
                    setHasUnreadChat(false);
                  }}
                >
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={!hasUnreadChat}
                  >
                    <RiChat4Line size={20} className={classes.navIcon} />
                  </Badge>
                </IconButton>
              </li>
              <li>
                <IconButton onClick={handleNotiMenuClick}>
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={!hasUnreadNotifications}
                  >
                    <RiNotification3Line
                      size={20}
                      className={classes.navIcon}
                    />
                  </Badge>
                </IconButton>
                <MainNavBarNotiMenu
                  anchorEl={anchorElNoti}
                  open={openNoti}
                  handleClose={handleNotiMenuClose}
                />
              </li>
              <li>
                <IconButton onClick={handleMenuClick}>
                  <Avatar
                    src={userPFP || ""}
                    sx={{ width: 36, height: 36 }}
                  ></Avatar>
                </IconButton>
                <MainNavBarMenu
                  anchorEl={anchorEl}
                  open={open}
                  handleClose={handleMenuClose}
                />
              </li>
            </ul>
          )}
        </Card>
      </header>
    </>
  );
}
