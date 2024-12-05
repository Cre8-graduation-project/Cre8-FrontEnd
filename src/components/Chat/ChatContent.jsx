import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { throttle, getAMPMTime, getDateString } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../Common/Toast";
import classes from "./ChatComponent.module.css";

export default function ChatContent({ roomId, chatContent, setChatContent }) {
  const { memberCode } = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  // Page Info
  const [pageSearchObj, setPageSearchObj] = useState({
    page: 1,
    size: 20,
    sort: ["createdAt,desc"],
  });
  const [hasNextPage, setHasNextPage] = useState(true);
  // Chat Content Ref
  const chatContentRef = useRef(null);
  // Initial Load Check
  const isInitialLoad = useRef(true);

  // Initial Load
  useEffect(() => {
    // Reset Page Info
    setPageSearchObj({
      page: 1,
      size: 20,
      sort: ["createdAt,desc"],
    });
    setHasNextPage(true);
    setIsFetching(true);
    // Fetch Data
    chatContentLoader(roomId).then((res) => {
      isInitialLoad.current = true;
      setChatContent(res);
      setHasNextPage(res.hasNextPage);
      setIsFetching(false);
    });
  }, [roomId]);

  // Move scroll to bottom at initial render and when new messages are received
  useEffect(() => {
    if (chatContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
      // 100px from bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= 100;

      if (isInitialLoad.current || isNearBottom) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        isInitialLoad.current = false;
      }
    }
  }, [chatContent]);

  const fetchPage = useCallback(
    throttle(() => {
      const scrollContainer = chatContentRef.current;
      const initialScrollHeight = scrollContainer.scrollHeight;
      const initialScrollTop = scrollContainer.scrollTop;
      // Fetch Data
      chatContentLoader(roomId, pageSearchObj).then((data) => {
        // Update Data
        setChatContent((prevContent) => ({
          ...prevContent,
          messageResponseDtoList: [
            ...prevContent.messageResponseDtoList,
            ...data.messageResponseDtoList,
          ],
        }));
        setPageSearchObj((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
        setHasNextPage(data.hasNextPage);
        setIsFetching(false);
        // Adjust scroll position after new content is rendered
        setTimeout(() => {
          const newScrollHeight = scrollContainer.scrollHeight;
          const scrollDiff = newScrollHeight - initialScrollHeight;
          scrollContainer.scrollTop = initialScrollTop + scrollDiff;
        }, 0);
      });
    }, 500),
    [roomId, pageSearchObj]
  );

  // Add Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
      // When to start loading (200px from top)
      const scrollThreshold = 200;

      if (scrollTop <= scrollThreshold && hasNextPage && !isFetching) {
        setIsFetching(true);
        fetchPage();
      }
    };

    const chatContentElement = chatContentRef.current;
    chatContentElement.addEventListener("scroll", handleScroll);
    return () => chatContentElement.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetching]);

  const reversedMessages = useMemo(() => {
    return chatContent?.messageResponseDtoList?.slice(0).reverse() || [];
  }, [chatContent]);

  // Chat Bubble Renderer
  const renderChatBubble = useCallback(
    (item, index) => {
      const bubbleClass =
        memberCode == item.senderId
          ? classes.chatMyBubble
          : classes.chatOthersBubble;

      const previousItem = reversedMessages[index - 1];
      const showDateIndicator = !previousItem ||
        getDateString(item.createdAt) !== getDateString(previousItem.createdAt);

      return (
        <div key={item.id || index}>
          {showDateIndicator && (
            <div className={classes.chatDateIndicator}>
              <p>{getDateString(item.createdAt)}</p>
            </div>
          )}
          <div className={`${classes.chatBubbleContainer} ${bubbleClass}`}>
            <div className={classes.chatReadCount}>
            {item.senderId == memberCode && item.readCount != 0 && (
              <p>{item.readCount}</p>
            )}
            <p>{getAMPMTime(item.createdAt)}</p>
            </div>
            <span className={classes.chatBubble}>{item.contents}</span>
          </div>
        </div>
      );
    },
    [memberCode, reversedMessages]
  );

  return (
    <div className={classes.chatContent} ref={chatContentRef}>
      {isFetching && <CircularProgress />}
      {!isFetching && reversedMessages.length === 0 && (
        <p>표시할 내용이 없습니다.</p>
      )}
      {reversedMessages.length > 0 && (
        <>{reversedMessages.map(renderChatBubble)}</>
      )}
    </div>
  );
}

// 채팅 데이터 요청 함수
async function chatContentLoader(
  roomId,
  pageSearchObj = { page: 0, size: 20, sort: ["createdAt,desc"] }
) {
  try {
    const response = await apiInstance.get(`/api/v1/chats/room/${roomId}`, {
      params: pageSearchObj,
    });
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
  }
  return {};
}
