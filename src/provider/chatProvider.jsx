import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

const wsAddress = import.meta.env.VITE_WS_SERVER;
const CONNECTION_TIMEOUT = 3000;

const chatClient = new Client();
chatClient.configure({
  brokerURL: wsAddress,
  connectHeaders: {
    Authorization: localStorage.getItem("token"),
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  debug: (msg) => {
    console.log(new Date(), msg);
  }
});

export default chatClient;

let activationPromise = null;

export const activateChatClient = () => {
  if(!activationPromise) {
    activationPromise = chatClient.activate();
  }
  return activationPromise;
};

export const deactivateChatClient = () => {
  chatClient.deactivate();
  activationPromise = null;
}

export function useChatConnection(roomId, onMessageReceived) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    let timeoutID;

    const connectionWithTimeout = async () => {
      setConnectionStatus('connecting');

      try {
        const connectPromise = activateChatClient();
        timeoutID = setTimeout(() => {
          setConnectionStatus('timeout');
          throw new Error('Connection Timeout');
        }, CONNECTION_TIMEOUT);
        // Await Connection for Certain amount of time
        await connectPromise;
        clearTimeout(timeoutID);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to connect:', error);
        setConnectionStatus('error');
      }
    }

    // Activate Chat Client on first run
    connectionWithTimeout();

    // Deactivate after chat is over
    return () => {
      clearTimeout(timeoutID);
      deactivateChatClient();
      setConnectionStatus('disconnected');
    };
  }, []);

  const subscribeToRoom = useCallback((roomId) => {
    if(roomId == -1 || connectionStatus !== 'connected') return;
    // Subscribe if roomId is valid
    let subscription;
    try {
      subscription = chatClient.subscribe(
        `/sub/chat/room/${roomId}`,
        (message) => {
          //console.log(message)
          if (message.body) {
            const msg = JSON.parse(message.body);
            onMessageReceived(msg);
          }
        }
      );
    } catch (error) {
      console.error('CHAT Subscription Error:', error);
      setConnectionStatus('error');
    }
    // Unsubscribe when it's unmounted
    return () => {
      if(subscription) {
        subscription.unsubscribe();
      }
    };
  }, [connectionStatus, onMessageReceived]); // Memoizes and only changes when onMsgReceived is changed

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId);
    return unsubscribe;
  }, [roomId, subscribeToRoom]);

  const sendMessage = useCallback((message) => {
    if(roomId == -1 || connectionStatus !== 'connected') return;
    // Send Message if roomId is valid
    try {
      chatClient.publish({
        destination: `/pub/message/${roomId}`,
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error("Send Message Error:", error);
      setConnectionStatus('error');
    }
  }, [roomId, connectionStatus]);

  return { sendMessage, connectionStatus };
}