import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./authProvider";
import apiInstance from "./networkProvider";

const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [hasUnreadChat, setHasUnreadChat] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notificationContent, setNotificationContent] = useState([]);

  const checkForNotifications = async () => {
    if (!isLoggedIn) return;

    try {
      const response = await apiInstance.get("/api/v1/notify/check");
      if (response.status === 200) {
        // 조회 성공
        setHasUnreadChat(response.data.data.unReadChat);
        setHasUnreadNotifications(response.data.data.unreadNotify);
        getNotificationContent();
      }
    } catch (error) {
      // 조회 실패
      //Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching notifications:", error);
    }
  };

  const getNotificationContent = async () => {
    try {
      const response = await apiInstance.get("/api/v1/notify");
      if (response.status === 200) {
        // 조회 성공
        setNotificationContent((prev) => [...prev, ...response.data.data]);
      }
    } catch (error) {
      // 조회 실패
      //Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching notification data:", error);
    }
    return [];
  }

  useEffect(() => {
    if (isLoggedIn) {
      checkForNotifications();
      // Set up an interval to check for notifications periodically
      const intervalId = setInterval(checkForNotifications, 60000); // Check every minute

      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (notificationContent.length > 0) {
      setHasUnreadNotifications(true);
    } else {
      setHasUnreadNotifications(false);
    }
  }, [notificationContent]);

  return (
    <NotificationContext.Provider
      value={{ 
        hasUnreadChat, 
        hasUnreadNotifications, 
        setHasUnreadChat,
        setHasUnreadNotifications,
        checkForNotifications,
        notificationContent,
        getNotificationContent,
        setNotificationContent,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
