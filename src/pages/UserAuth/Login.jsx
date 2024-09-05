import { useState, useEffect } from "react";
import { Form, useNavigation, useNavigate } from "react-router-dom";
import { Link, Button } from "@mui/material";

import { onLogin } from "../../provider/authProvider";
import UserValidate from "../../provider/UserValidate";
import { Toast } from "../../components/Toast";
import apiInstance from "../../provider/networkProvider";
import classes from "./UserAuth.module.css";

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

  // 로그인 요청 handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (Object.keys(loginError).length) {
      // 입력값 오류가 한 개 이상 발견 시
      Toast.loginError("입력하신 내용들을 다시 확인해주세요!");
      setFocus(FOCUS_ALL_DATA);
    } else {
      // 로그인 시도
      const success = await sendLoginRequest(loginData);
      // 로그인 성공 시 메인 페이지로 이동
      if (success) {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <Form onSubmit={handleLogin} className={classes.authForm}>
        <h2>로그인</h2>
        <ul>
          <li>
            <h5>아직 회원이 아니신가요?</h5>
          </li>
          <li>
            <Link href="register">
              <h5>회원가입</h5>
            </Link>
          </li>
        </ul>
        <div className={classes.authLabel}>
          <label htmlFor="userID">아이디 *</label>
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
        <div className={classes.authLabel}>
          <label htmlFor="password">비밀번호 *</label>
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
          <li>
            <h5>비밀번호가 기억나지 않으시나요?</h5>
          </li>
          <li>
            <Link href="recoverPassword">
              <h5>비밀번호 찾기</h5>
            </Link>
          </li>
        </ul>
        <div className={classes.authLabel}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중" : "로그인"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// 로그인 요청 함수
const sendLoginRequest = async (inputData) => {
  try {
    const response = await apiInstance.post("/api/v1/auth/login", inputData);
    if (response.status === 201) {
      // 로그인 성공
      onLogin({
        newToken: response.headers.authorization,
        newUserID: response.data.data.loginId,
        newMemberCode: response.data.data.memberId,
      });

      Toast.loginSuccess(`${inputData.userID}님 환영합니다.`);
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // 로그인 실패
      Toast.loginError("아이디 또는 비밀번호가 틀립니다.");
    } else {
      Toast.loginError("알 수 없는 오류가 발생했습니다.");
    }
  }
  return false;
};

const FOCUS_ALL_DATA = {
  userID: true,
  password: true,
};
