import { useState, useCallback, useEffect } from "react";
import { useRouteLoaderData, useLocation } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Card,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TitleBar from "../../components/Common/TitleBar";
import ChatListCard from "../../components/Chat/ChatListCard";
import ChatTopBar from "../../components/Chat/ChatTopBar";
import ChatInputBar from "../../components/Chat/ChatInputBar";
import { Toast } from "../../components/Common/Toast";
import ChatContent from "../../components/Chat/ChatContent";
import { useAuth } from "../../provider/authProvider";
import { useChatConnection } from "../../provider/chatProvider";
import { isEmpty } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";

import classes from "./Chat.module.css";

export default function ChatPage() {
  const loadedData = useRouteLoaderData("chat-page");
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { memberCode } = useAuth(); 
  const [data, setData] = useState(loadedData);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState({
    roomId: -1,
    nickName: "",
    accessUrl: "",
  });
  const [chatContent, setChatContent] = useState([]);
  const location = useLocation();
  const chatQuery = location.state?.chatQuery ?? {};

  useEffect(() => {
    // Immediately start chat upon request
    if (!isEmpty(chatQuery)) {
      chatRequestWithUserCode(chatQuery.targetCode).then((res) => {
        if (res != null) {
          setSelectedRoom({ roomId: res, nickName: chatQuery.targetNickName });
        }
      });
    }
  }, []);

  const onMsgReceived = useCallback((msg) => {
    if(msg.messageType == "ENTER") {
      // update read count to 0 in chatContent
      setChatContent((prevChat) => {
        const updatedMessageList = [...(prevChat.messageResponseDtoList || [])];
        for (let i = updatedMessageList.length - 1; i >= 0; i--) {
          if (updatedMessageList[i].senderId === memberCode && updatedMessageList[i].readCount === 1) {
            updatedMessageList[i] = { ...updatedMessageList[i], readCount: 0 };
          } else if (updatedMessageList[i].readCount === 0) {
            break;
          }
        }
        return {  
          ...prevChat,
          messageResponseDtoList: updatedMessageList,
        };
      });
    }
    else if(msg.messageType == "MESSAGE") {
      // update chat content
      setChatContent((prevChat) => {
        const updatedMessageList = [msg, ...(prevChat.messageResponseDtoList || [])];
        return {
          ...prevChat,
          messageResponseDtoList: updatedMessageList,
        };
      });
      // update chat list
      setData((prevData) => {
        const listIndex = prevData.findIndex(
          (item) => item.roomId == selectedRoom.roomId
        );
        if (listIndex === -1) return prevData;
        const updatedObj = {
          ...prevData[listIndex],
          latestMessage: msg.contents,
        };

        return [
          updatedObj,
          ...prevData.slice(0, listIndex),
          ...prevData.slice(listIndex + 1),
        ];
      });
    }
  }, [selectedRoom.roomId]);
  
  const { sendMessage, connectionStatus } = useChatConnection(
    selectedRoom.roomId,
    onMsgReceived
  );
  //console.log(connectionStatus);

  // Start Chat Button
  const handleStartChatClick = () => {
    setNewChatDialogOpen(true);
  };
  const handleDialogClose = () => {
    setNewChatDialogOpen(false);
  };
  const handleDialogSubmit = (e) => {
    e.preventDefault();
    // fetch userID
    const formData = new FormData(e.currentTarget);
    const formJSON = Object.fromEntries(formData.entries());
    const userID = formJSON.userID;
    // send
    if (connectionStatus === "connected") {
      chatRequest(userID).then((res) => {
        if (res != null) {
          setSelectedRoom({ roomId: res, nickName: userID });
          ChatListLoader().then((listRes) => {
            setData(listRes);
          });
        }
      });
      handleDialogClose();
    } else {
      Toast.error("채팅 서버에 연결되지 않았습니다. 나중에 다시 시도해주세요.");
    }
  };
  const handleListClick = (key, name) => {
    if (connectionStatus === "connected") {
      setSelectedRoom({ roomId: key, nickName: name });
    } else {
      Toast.error("채팅 서버에 연결되지 않았습니다. 나중에 다시 시도해주세요.");
    }
  };
  const handleChatSend = (chatInput) => {
    if (connectionStatus === "connected") {
      sendMessage(chatInput);
    } else {
      Toast.error("메시지를 보낼 수 없습니다. 네트워크 상태를 확인해주세요.");
    }
  };

  const RenderConnectionStatus = () => {
    switch (connectionStatus) {
      case "connecting":
        return <p>채팅 서버에 연결 중입니다...</p>;
      case "error":
      case "timeout":
        return <p>채팅 서버에 연결할 수 없습니다. 나중에 다시 시도해주세요.</p>;
      default:
        return null;
    }
  };

  return (
    <Card className={classes.chatPage}>
      <TitleBar title="채팅">
        <Button
          variant="contained"
          color="secondary"
          aria-hidden={false}
          onClick={handleStartChatClick}
        >
          채팅 시작하기
        </Button>
        <Dialog
          open={newChatDialogOpen}
          onClose={handleDialogClose}
          PaperProps={{
            component: "form",
            onSubmit: handleDialogSubmit,
          }}
        >
          <DialogTitle>새로운 채팅</DialogTitle>
          <DialogContent>
            <DialogContentText>
              채팅을 시작할 상대의 아이디를 입력해주세요.
            </DialogContentText>
            <TextField
              autoFocus
              required
              fullWidth
              margin="dense"
              name="userID"
              label="사용자 아이디"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>취소</Button>
            <Button type="submit">대화 시작</Button>
          </DialogActions>
        </Dialog>
      </TitleBar>
      <div className={classes.chatMain}>
        {(!matchDownSm || selectedRoom.roomId == -1) && (
          <div className={!matchDownSm ? classes.chatList : classes.chatListSm}>
            {data != null &&
              data.map((item, index) => (
                <ChatListCard
                  key={index}
                  name={item.nickName}
                  message={item.latestMessage}
                  unReadCount={item.unReadMessage}
                  onClick={() => {
                    handleListClick(item.roomId, item.nickName);
                  }}
                />
              ))}
          </div>
        )}
        {(!matchDownSm || selectedRoom.roomId != -1) && (
          <div className={classes.chatContent}>
            {selectedRoom.roomId == -1 && <RenderConnectionStatus />}
            {selectedRoom.roomId > -1 && (
              <>
                <ChatTopBar
                  name={selectedRoom.nickName}
                  accessUrl={selectedRoom.accessUrl}
                  backBtn={matchDownSm}
                  onBackClick={() => {
                    setSelectedRoom({roomId: -1, nickName: ""});
                  }}
                />
                <ChatContent
                  roomId={selectedRoom.roomId}
                  chatContent={chatContent}
                  setChatContent={setChatContent}
                  updateAvatar={(url) => {
                    setSelectedRoom((prev) => ({ ...prev, accessUrl: url }));
                  }}
                />
                <ChatInputBar handleChatSend={handleChatSend} />
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// 채팅 시작 요청 함수
async function chatRequest(uID) {
  //console.log(uID);
  try {
    const response = await apiInstance.get("/api/v1/members/pk", {
      params: { loginId: uID },
    });
    if (response.status === 200) {
      // 조회 성공
      try {
        const chatResponse = await apiInstance.get(
          `/api/v1/chats/user/${response.data.data}`
        );
        if (chatResponse.status === 200) {
          return chatResponse.data.data;
        }
      } catch (error) {
        //console.error(error.message);
      }
      return null;
    }
  } catch (error) {
    // 조회 실패
    //console.error(error.message);
    Toast.error("입력한 대상을 찾을 수 없습니다.");
  }
  return null;
}

// 채팅 시작 요청 함수
async function chatRequestWithUserCode(uCode) {
  //console.log(uCode);
  try {
    const chatResponse = await apiInstance.get(`/api/v1/chats/user/${uCode}`);
    if (chatResponse.status === 200) {
      return chatResponse.data.data;
    }
  } catch (error) {
    //console.error(error.message);
    Toast.error("입력한 대상을 찾을 수 없습니다.");
  }
  return null;
}

// 채팅 목록 데이터 요청 함수
export async function ChatListLoader({ request, params }) {
  try {
    const response = await apiInstance.get("/api/v1/chats/room");
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    //console.error(error.message);
  }
  return [];
}
