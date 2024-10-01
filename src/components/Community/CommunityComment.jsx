import { useState, useEffect } from "react";
import { Avatar, Link, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { RiMore2Line } from "@remixicon/react";

import CommunityTextField from "./CommunityTextField";
import CommunityCommentBox from "./CommunityCommentBox";
import { isEmpty } from "../../provider/utilityProvider";
import { useAuth } from "../../provider/authProvider";
import classes from "./CommComponent.module.css";

export default function CommunityComment({
  communityPostId,
  commentData,
  isUpdating,
  setIsUpdating,
}) {
  const { isLoggedIn } = useAuth();
  const [replyTextFieldTarget, setReplyTextFieldTarget] = useState(-1);

  // Close Reply TextField if new comment is uploaded
  useEffect(() => {
    if(isUpdating === "done") {
      // Close Reply TextField
      setReplyTextFieldTarget(-1);
    }
  }, [isUpdating])

  return (
    <>
      {!isEmpty(commentData) &&
        commentData.map((item, index) => (
          <div key={`COMMENT_${index}`}>
            <CommunityCommentBox item={item.parentReplyResponseDto} />
            {replyTextFieldTarget == item?.parentReplyResponseDto?.replyId &&
              isLoggedIn && (
                <CommunityTextField
                  communityPostId={communityPostId}
                  parentReplyId={item.parentReplyResponseDto.replyId}
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                />
              )}
            {!isEmpty(item.childReplyResponseDto) &&
              item.childReplyResponseDto.map((reply, index) => (
                <div key={`REPLY_${index}`}>
                  <CommunityCommentBox 
                    item={reply} 
                    isReply={true} 
                    setIsUpdating={setIsUpdating}
                  />
                </div>
              ))}
          </div>
        ))}
    </>
  );
}