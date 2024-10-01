import { useState } from "react";
import { TextField, Button } from "@mui/material";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../Common/Toast";
import classes from "./CommComponent.module.css";

export default function CommunityTextField({
  communityPostId,
  parentReplyId,
  isUpdating,
  setIsUpdating,
}) {
  const { isLoggedIn } = useAuth();
  const [commentData, setCommentData] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    setIsUpdating("true");
    // Upload Comment
    CommunityPostCommentRequest({
      ...(communityPostId && { communityPostId }),
      ...(parentReplyId && { parentReplyId }),
      contents: commentData,
    }).then((res) => {
      if (res == "201") {
        setIsUpdating("done");
      }
    });
  };

  return (
    <div className={classes.communityCommentTextField}>
      <TextField
        value={commentData}
        onChange={(e) => setCommentData(e.target.value)}
        size="small"
        multiline={true}
        rows={2}
        fullWidth
      />
      <Button
        variant="contained"
        color={parentReplyId == undefined ? "primary" : "secondary"}
        disabled={!isLoggedIn || isUpdating !== "false"}
        onClick={handleAddComment}
      >
        {parentReplyId == undefined ? "댓글 등록" : "답글 등록"}
      </Button>
    </div>
  );
}

// 커뮤니티 게시글 댓글 등록 함수
async function CommunityPostCommentRequest(input) {
  try {
    const response = await apiInstance.post(
      "/api/v1/community/posts/reply",
      input
    );
    // 추가 성공
    if (response.status === 201) {
      // 조회 성공
      return response.status;
    }
  } catch (error) {
    // 추가 실패
    Toast.error("댓글 등록 중 오류가 발생했습니다.");
  }
  return 0;
}
