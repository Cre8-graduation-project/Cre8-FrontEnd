import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useState, useRef } from "react";

const wsAddress = import.meta.env.VITE_WS_SERVER;
const CONNECTION_TIMEOUT = 3000;

const chatClient = new Client();

const configureChatClient = () => {
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
};

export default chatClient;

let activationPromise = null;

export const activateChatClient = () => {
  if(!activationPromise) {
    configureChatClient();
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
  const [subscription, setSubscription] = useState(null);

  const subscribeToRoom = useCallback((roomId) => {
    if(roomId == -1 || connectionStatus !== 'connected') return;

    // Subscribe to Room
    const subscribe = async (attempt) => {
      try {
        const newSubscription = chatClient.subscribe(
          `/sub/chat/room/${roomId}`,
          (message) => {
            //console.log(message)
            if (message.body) {
              const msg = JSON.parse(message.body);
              onMessageReceived(msg);
            }
          },
          { id: roomId.toString() }
        );
        setSubscription(newSubscription);
      } catch (error) {
        if (attempt <= 3) {
          //console.warn(`Attempt ${attempt} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          await subscribe(attempt + 1);
        } else {
          //console.error("CHAT Subscription Error:", error);
          setConnectionStatus('error');
        }
      }
    }

    // Subscribe to Room
    subscribe(1);
  }, [connectionStatus, onMessageReceived, subscription]);

  const unsubscribeFromRoom = useCallback(() => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
  }, [subscription]);

  const handleDisconnect = useCallback(() => {
    //console.log("STOMP connection disconnected");
    setConnectionStatus("disconnected");
  }, []);

  const handleReconnect = useCallback(() => {
    //console.log("STOMP connection re-established");
    setConnectionStatus("connected");
  }, []);

  const sendMessage = useCallback((message) => {
    if(roomId == -1 || connectionStatus !== 'connected') return;
    // Send Message if roomId is valid
    const publishMessage = async (attempt) => {
      if (!chatClient.connected) {
        //console.warn(
        //  "STOMP connection not established. Attempting to reconnect..."
        //);
        try {
          await activateChatClient();
        } catch (error) {
          //console.error("Failed to reconnect:", error);
          setConnectionStatus("error");
          return;
        }
      }

      try {
        chatClient.publish({
          destination: `/pub/message/${roomId}`,
          body: JSON.stringify({ message }),
        });
      } catch (error) {
        if (attempt <= 3) {
          //console.warn(`Attempt ${attempt} failed, retrying...`);
          await publishMessage(attempt + 1);
        } else {
          //console.error("Send Message Error:", error);
          setConnectionStatus('error');
        }
      }
    };
    // Try Publishing Message
    publishMessage(1);
  }, [roomId, connectionStatus]);

  // Connect to Chat Server
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
        //console.error('Failed to connect:', error);
        setConnectionStatus('error');
      }
    }

    // Activate Chat Client on first run
    connectionWithTimeout();

    // Set up reconnection listener
    chatClient.onWebSocketClose = handleDisconnect;
    chatClient.onConnect = handleReconnect;

    // Deactivate after chat is over
    return () => {
      clearTimeout(timeoutID);
      unsubscribeFromRoom();
      deactivateChatClient();
      setConnectionStatus('disconnected');
    };
  }, []);

  // Subscribe to Room
  useEffect(() => {
    if (connectionStatus === "connected" && roomId !== -1) {
      // Unsubscribe from previous room
      unsubscribeFromRoom();
      // Subscribe to new room
      subscribeToRoom(roomId);
    }
  }, [roomId, connectionStatus]);

  return { sendMessage, connectionStatus };
}