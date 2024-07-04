import { useState, useEffect } from "react";
import { Form, useNavigation, useNavigate } from "react-router-dom";
import { Link } from "@mui/material";

import { useAuth } from "../../provider/authProvider";
import UserValidate from "../../components/Auth/UserValidate";
import { Toast } from "../../components/Toast";
import classes from "./UserAuth.module.css";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function LoginPage() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // 사용자 입력 정보
  const [loginData, setLoginData] = useState({
    userID: "",
    password: "",
  });
  const [focus, setFocus] = useState({});
  const [loginError, setLoginError] = useState({});

  const { onLogin } = useAuth();

  useEffect(() => {
    setLoginError(UserValidate(loginData, "signin"));
  }, [loginData, focus]);

  const handleFocus = (e) => {
    setFocus({ ...focus, [e.target.name]: true });
  };

  // 사용자 입력 event handler
  // - 사용자 입력 데이터 저장
  const handleChange = (e) => {
    setLoginData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (Object.keys(loginError).length) {
      // 입력값 오류가 한 개 이상 발견 시
      Toast.loginError("입력하신 내용들을 다시 확인해주세요!");
      setFocus(FOCUS_ALL_DATA);
    } else {
      // 로그인 시도
      const response = await sendLoginRequest(loginData);
      switch (response.status) {
        case 201:
          // 로그인 성공
          const json = await response.json();
          const token = response.headers.get("Authorization")
          const userID = json.data.userId;
          const memberCode = json.data.memberId;
          onLogin({ token, userID, memberCode });
          Toast.loginSuccess(`${userID}님 환영합니다.`);
          navigate("/");
          break;
        case 400:
          // 로그인 실패
          Toast.loginError("아이디 또는 비밀번호가 틀립니다.");
          break;
        default:
          Toast.loginError("알 수 없는 오류가 발생했습니다.");
          break;
      }
    }
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <section className={classes.authSection}>
        <h1>로그인</h1>
        <ul>
          <li><h5>아직 회원이 아니신가요?</h5></li>
          <li><Link href="register"><h5>회원가입</h5></Link></li>
        </ul>
        <Form onSubmit={handleLogin} className={classes.authForm}>
          <div>
            <label htmlFor="userID">아이디</label>
            <input
              id="userID"
              name="userID"
              type="text"
              value={loginData.userID}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {loginError.userID && focus.userID && (
              <span>{loginError.userID}</span>
            )}
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {loginError.password && focus.password && (
              <span>{loginError.password}</span>
            )}
          </div>
          <ul className={classes.rightUL}>
            <li><h5>비밀번호가 기억나지 않으시나요?</h5></li>
            <li><Link href="recoverPassword"><h5>비밀번호 찾기</h5></Link></li>
          </ul>
          <div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중" : "로그인"}
            </button>
          </div>
        </Form>
      </section>
    </div>
  );
}

// 로그인 요청 함수
async function sendLoginRequest(inputData) {
  let url = apiAddress + "/api/v1/auth/login";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
    credentials: "include",
  });

  return response;
}

const FOCUS_ALL_DATA = {
  userID: true,
  password: true,
};
