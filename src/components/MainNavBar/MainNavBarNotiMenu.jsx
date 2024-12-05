import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { RiExternalLinkLine } from "@remixicon/react";

import { isEmpty } from "../../provider/utilityProvider";
import { useNotifications } from "../../provider/notificationProvider";
import classes from "./MainNavBar.module.css";

export default function MainNavBarNotiMenu({ anchorEl, open, handleClose }) {
  const navigate = useNavigate();
  const { 
    notificationContent,
    setNotificationContent,
  } = useNotifications();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      disableScrollLock={true}
      slotProps={{
        paper: {
          style: {
            maxHeight: 32 * 8,
            width: "25rem",
          },
        },
      }}
      className={classes.navNotiMenu}
    >
      <h4>알림</h4>
      <Divider />
      {isEmpty(notificationContent) ? (
        <MenuItem>
          <ListItemText>알림이 없습니다.</ListItemText>
        </MenuItem>
      ) : (
        notificationContent.map((item, index) => (
          <MenuItem
            key={index}
            sx={{ minHeight: "32px" }}
            onClick={() => {
              if (item.notificationType === "COMMUNITY") {
                setNotificationContent((prev) => {
                  return [...prev.slice(0, index), ...prev.slice(index + 1)];
                });
                navigate(`/c/${item.postId}`);
              }
            }}
          >
            <Typography variant="inherit" noWrap width="100%">
              <span style={{ 
                fontWeight: "bold", 
                fontSize: "10px", 
                margin: "0", 
                display: "block" 
              }}>
                {item.notificationType}
              </span>
              {item.contents}
            </Typography>
            <RiExternalLinkLine
              size={18}
              style={{ marginBottom: "2px", marginLeft: "12px" }}
            />
          </MenuItem>
        ))
      )}
    </Menu>
  );
}