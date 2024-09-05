import { createContext, useContext, useMemo, useEffect, useState, useCallback } from "react";
import apiInstance from "./networkProvider";
import { Toast } from "../components/Toast";

const TOKEN_REISSUE_INTERVAL = 5 * 60 * 1000 // 5 minutes

let logoutFunction = null;
let onLoginFunction = null;

// 컴포넌트 간 Auth 상태를 공유하는데 사용될 Context Object
const AuthContext = createContext();

// AuthContext를 위한 Provider.
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));
  const [memberCode, setMemberCode] = useState(localStorage.getItem("memberCode"));

  // Request new accessToken
  const reissueToken = useCallback(async () => {
    if (!token) return; // Don't attempt to reissue if there's no token

    try {
      const response = await apiInstance.post("/api/v1/auth/reissue", null, {
        headers: {
          accessToken: token,
        }
      });
      if (response.status === 200) {
        setToken(response.data.data.accessToken);
      }
      else {
        // refreshToken deprecated
        logout();
      }
    } catch (error) {
      //console.error("Error reissuing token:", error);
      logout();
    }
  }, [token]);
  
  useEffect(() => {
    const intervalId = setInterval(reissueToken, TOKEN_REISSUE_INTERVAL);
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [reissueToken]);
  
  // This feature runs whenever Token values are changed
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Feature for Successful Login
  const onLogin = useCallback(({ newToken, newUserID, newMemberCode }) => {
    setToken(newToken);
    setUserID(newUserID);
    setMemberCode(newMemberCode);
    localStorage.setItem("userID", newUserID);
    localStorage.setItem("memberCode", newMemberCode);
  }, []);
  onLoginFunction = onLogin;

  // Logout Feature
  const logout = useCallback(async () => {
    console.log("Logging out!")

    try {
      const response = await apiInstance.post("/api/v1/auth/logout", null, {
        headers: {
          accessToken: token,
        }
      });
      if (response.status === 200) {
        Toast.success("로그아웃되었습니다.");
      }
    } catch (error) {
      Toast.error("로그아웃 도중 오류가 발생했습니다.");
    }

    setToken("");
    setUserID("");
    setMemberCode("");
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("memberCode");
  }, [token]);
  logoutFunction = logout;

  const contextValue = useMemo(
    () => ({
      token,
      userID,
      memberCode,
      setToken,
      reissueToken,
      onLogin,
      logout,
      isLoggedIn: !!token,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Exposed Feature sets
export const requestLogout = () => logoutFunction && logoutFunction();
export const onLogin = ({ newToken, newUserID, newMemberCode }) =>
  onLoginFunction && onLoginFunction({ newToken, newUserID, newMemberCode });

export default AuthProvider;
