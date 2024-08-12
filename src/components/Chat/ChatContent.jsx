import { useEffect, useRef } from "react";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import classes from "./ChatComponent.module.css";

export default function ChatContent({ roomId, chatContent, setChatContent }) {
  const { memberCode } = useAuth();

  // Move scroll to bottom at initial render
  function ScrollToBottom() {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  useEffect(() => {
    chatContentLoader(roomId).then((res) => {
      setChatContent(res);
    });
  }, [roomId]);

  return (
    <div className={classes.chatContent}>
      {chatContent.length == 0 && <p>Content is empty.</p>}
      {chatContent.length != 0 &&
        chatContent.map((item, index) => {
          if (memberCode == item.senderId) {
            return (
              <span key={index} className={`${classes.chatBubble} ${classes.chatMyBubble}`}>
                {item.contents}
              </span>
            );
          } else {
            return (
              <span key={index} className={`${classes.chatBubble} ${classes.chatOthersBubble}`}>
                {item.contents}
              </span>
            );
          }
        })
      }
      <ScrollToBottom />
    </div>
  );
}

// 채팅 데이터 요청 함수
async function chatContentLoader(roomId) {
  try {
    const response = await apiInstance.get(`/api/v1/chats/room/${roomId}`);
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return [];
}
