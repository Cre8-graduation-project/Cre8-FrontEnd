import { useState, useEffect } from "react";
import {
  Avatar,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { RiMore2Line } from "@remixicon/react";

import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../Common/Toast";
import classes from "./CommComponent.module.css";

export default function CommunityCommentBox({
  item,
  isReply = false,
  setIsUpdating = () => {},
  setReplyTextFieldTarget = () => {},
}) {
  const { isLoggedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [contents, setContents] = useState(item.contents);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { memberCode } = useAuth();
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    CommunityCommentDeleteRequest(item.replyId).then((res) => {
      if (res == 200) {
        Toast.success("댓글 삭제 성공");
        // 댓글 삭제 성공 시 댓글 목록 갱신
        setIsUpdating("done");
      }
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setContents(item.contents);
  };

  const handleSaveEdit = () => {
    CommunityCommentUpdateRequest(item.replyId, contents).then((res) => {
      if (res == 200) {
        Toast.success("댓글 수정 성공");
        // 댓글 수정 성공 시 댓글 목록 갱신
        setIsEditing(false);
        setIsUpdating("done");
      }
    });
  };

  return (
    <div
      className={
        !isReply
          ? classes.communityComment
          : `${classes.communityComment} ${classes.communityReply}`
      }
    >
      <Avatar src={item.memberAccessUrl} sx={{ marginTop: "0.1rem" }} />
      <span className={classes.communityCommentContent}>
        <h4>{item.memberNickName}</h4>
        {!isEditing ? (
          <p>{item.contents}</p>
        ) : (
          <>
            <TextField
              multiline
              rows={2}
              fullWidth
              size="small"
              sx={{ backgroundColor: "white" }}
              value={contents}
              onChange={(e) => setContents(e.target.value)}
            />
            <div className={classes.communityCommentButtonArea}>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleCancelEdit}
              >
                취소
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
              >
                수정
              </Button>
            </div>
          </>
        )}
        {isLoggedIn && !isReply && (
          <Link
            component="button"
            style={{ fontSize: "14px" }}
            onClick={() => setReplyTextFieldTarget(item.replyId)}
          >
            답글 달기
          </Link>
        )}
      </span>
      {isLoggedIn && item.memberId === memberCode && (
        <>
          <IconButton
            className={classes.communityCommentMoreButton}
            onClick={handleMenuClick}
          >
            <RiMore2Line />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            disableScrollLock={true}
          >
            <MenuItem sx={{ minHeight: "32px" }} onClick={handleEdit}>
              댓글 수정
            </MenuItem>
            <Divider />
            <MenuItem sx={{ minHeight: "32px" }} onClick={handleDelete}>
              댓글 삭제
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

// 커뮤니티 댓글 삭제 요청 함수
async function CommunityCommentDeleteRequest(replyId) {
  try {
    const response = await apiInstance.delete(
      `/api/v1/community/posts/reply/${replyId}`
    );
    // 성공
    return response.status;
  } catch (error) {
    // 실패
    //console.error(error.message);
    Toast.error("댓글 삭제 중 오류가 발생했습니다.");
  }
  return 0;
}

// 커뮤니티 댓글 수정 요청 함수
async function CommunityCommentUpdateRequest(replyId, contents) {
  try {
    const response = await apiInstance.patch("/api/v1/community/posts/reply", {
      replyId,
      contents,
    });
    // 성공
    return response.status;
  } catch (error) {
    // 실패
    //console.error(error.message);
    Toast.error("댓글 수정 중 오류가 발생했습니다.");
  }
  return 0;
}
