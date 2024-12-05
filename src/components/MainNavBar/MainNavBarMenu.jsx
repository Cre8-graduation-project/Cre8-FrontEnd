import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  RiArticleLine,
  RiBookmarkLine,
  RiLogoutBoxLine,
  RiUserLine,
  RiSettings3Line,
} from "@remixicon/react";

import { useAuth } from "../../provider/authProvider";

export default function MainNavBarMenu({
  anchorEl,
  open,
  handleClose,
}) {
  const navigate = useNavigate();
  const { logout, userID } = useAuth();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      disableScrollLock={true}
    >
      <MenuItem
        sx={{ minHeight: "32px" }}
        onClick={() => navigate(`/p/${userID}`)}
      >
        <ListItemIcon>
          <RiUserLine size={22} />
        </ListItemIcon>
        <ListItemText>프로필</ListItemText>
      </MenuItem>
      <MenuItem sx={{ minHeight: "32px" }} onClick={() => navigate("/my-post")}>
        <ListItemIcon>
          <RiArticleLine size={22} />
        </ListItemIcon>
        <ListItemText>My 게시글</ListItemText>
      </MenuItem>
      <MenuItem
        sx={{ minHeight: "32px" }}
        onClick={() => navigate("/bookmark")}
      >
        <ListItemIcon>
          <RiBookmarkLine size={22} />
        </ListItemIcon>
        <ListItemText>My 북마크 & 좋아요</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ minHeight: "32px" }} onClick={() => navigate("/settings")}>
        <ListItemIcon>
          <RiSettings3Line size={22} />
        </ListItemIcon>
        <ListItemText>계정 설정</ListItemText>
      </MenuItem>
      <MenuItem sx={{ minHeight: "32px" }} onClick={logout}>
        <ListItemIcon>
          <RiLogoutBoxLine size={22} />
        </ListItemIcon>
        <ListItemText>로그아웃</ListItemText>
      </MenuItem>
    </Menu>
  );
}
