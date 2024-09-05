import { useState, useEffect } from "react";
import { Form, useSubmit, useNavigation, redirect } from "react-router-dom";
import { Link, Button, Select, MenuItem } from "@mui/material";

import UserValidate from "../../provider/UserValidate";
import { Toast } from "../../components/Toast";
import classes from "./UserAuth.module.css";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function RegisterPage() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // 사용자 입력 정보
  const [registerData, setRegisterData] = useState(INIT_ERROR_DATA);
  const [focus, setFocus] = useState({});
  const [registerError, setRegisterError] = useState({});

  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    setRegisterError(UserValidate(registerData, "signup"));
  }, [registerData, focus]);

  const handleFocus = (e) => {
    setFocus({ ...focus, [e.target.name]: true });
  };

  // 사용자 입력 event handler
  // - 사용자 입력 데이터 저장
  const handleChange = (e) => {
    if (e.target.name === "authCode") {
      setInputCode(e.target.value);
    } else {
      setRegisterData((prevData) => {
        return {
          ...prevData,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  // 제출 event handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(registerError).length) {
      // 입력값 오류가 한 개 이상 발견 시
      Toast.registerError("입력하신 내용들을 다시 확인해주세요!");
      setFocus(FOCUS_ALL_DATA);
    } else if (!isCodeSent) {
      // 입력값 오류 없음 & 이메일 인증번호 전송 전
      checkDuplicateId(registerData.loginId).then((resID) => {
        switch (resID.status) {
          // 아이디 사용 가능
          case 200:
            delete registerError.loginId; // 아이디 오류 메시지 제거
            // 이메일 인증번호 발송 요청
            sendVerifyCode(registerData.email).then((resCode) => {
              switch (resCode.status) {
                // 이메일 사용 가능
                case 200:
                  setIsCodeSent(true);
                  break;
                // 이메일 사용 불가 (중복)
                case 400:
                  setRegisterError({
                    ...registerError,
                    email: "이미 사용 중인 이메일입니다.",
                  });
                  break;
              }
            });
            break;
          // 아이디 사용 불가 (중복)
          case 400:
            setRegisterError({
              ...registerError,
              loginId: "이미 사용 중인 아이디입니다.",
            });
            break;
        }
      });
      setFocus(FOCUS_ALL_DATA);
    } else {
      // 입력값 오류 없음 & 인증번호 전송 후
      // 인증번호 검증
      checkVerifyCode({
        email: registerData.email,
        authNum: inputCode,
      }).then((res) => {
        if (res.status === 200) {
          submit(registerData, { method: "POST" });
        }
        // console.log(registerData);
      });
    }
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <Form method="POST" className={classes.authForm}>
        <h2>회원가입</h2>
        <ul>
          <li>
            <h5>이미 계정이 있으신가요?</h5>
          </li>
          <li>
            <Link href="login">
              <h5>로그인</h5>
            </Link>
          </li>
        </ul>
        <div className={classes.authLabel}>
          <label htmlFor="loginId">아이디 *</label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            value={registerData.loginId}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.loginId && focus.loginId && (
            <span>{registerError.loginId}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="password">비밀번호 *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={registerData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.password && focus.password && (
            <span>{registerError.password}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="confirmPassword">비밀번호 확인 *</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={registerData.confirmPassword}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.confirmPassword && focus.confirmPassword && (
            <span>{registerError.confirmPassword}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="email">이메일 *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={registerData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.email && focus.email && (
            <span>{registerError.email}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="nickName">별명 *</label>
          <input
            id="nickName"
            name="nickName"
            type="text"
            value={registerData.nickName}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.nickName && focus.nickName && (
            <span>{registerError.nickName}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="name">이름 *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={registerData.name}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.name && focus.name && (
            <span>{registerError.name}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="sex">성별 *</label>
          <Select
            id="sex"
            name="sex"
            value={registerData.sex}
            autoWidth
            size="small"
            onChange={handleChange}
            onFocus={handleFocus}
          >
            <MenuItem value="" disabled>
              선택해주세요.
            </MenuItem>
            <MenuItem value="M">남자</MenuItem>
            <MenuItem value="W">여자</MenuItem>
          </Select>
          {registerError.sex && focus.sex && <span>{registerError.sex}</span>}
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="birthDay">생년월일 *</label>
          <input
            id="birthDay"
            name="birthDay"
            type="date"
            max="9999-12-31"
            value={registerData.date}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {registerError.birthDay && focus.birthDay && (
            <span>{registerError.birthDay}</span>
          )}
        </div>
        <div style={{ display: isCodeSent ? undefined : "none" }} className={classes.authLabel}>
          <label htmlFor="authCode">확인 코드 *</label>
          <input
            id="authCode"
            name="authCode"
            type="authCode"
            value={inputCode}
            onChange={handleChange}
            onFocus={handleFocus}
            disabled={!isCodeSent}
            required
          />
          {registerError.authCode && focus.authCode && (
            <span>{registerError.authCode}</span>
          )}
        </div>
        <div className={classes.authLabel}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: "2rem" }}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "회원가입 중" : "회원가입"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// 중복 아이디 검증 함수
async function checkDuplicateId(loginId) {
  let url = apiAddress + "/api/v1/members/check?login-id=" + loginId;

  const response = await fetch(url, { method: "GET" });

  switch (response.status) {
    // 아이디 사용 가능
    case 200:
      break;
    // 아이디 사용 불가 (중복)
    case 400:
      Toast.registerError("이미 사용 중인 아이디입니다.");
      break;
    // 기타 오류
    default:
      Toast.registerError("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}

// 이메일 인증번호 요청 함수
async function sendVerifyCode(inputEmail) {
  let url = apiAddress + "/api/v1/mail";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: inputEmail }),
  });

  switch (response.status) {
    case 200:
      Toast.registerSuccess("입력한 주소로 인증번호를 전송했습니다.");
      break;
    case 400:
      Toast.registerError("이미 사용 중인 이메일 주소입니다.");
      break;
    case 500:
      Toast.registerError("메일 서버와 연결할 수 없습니다.");
      break;
    default:
      Toast.registerError("알 수 없는 오류가 발생했습니다.");
      break;
  }
  return response;
}

// 이메일 인증번호 검증 함수
async function checkVerifyCode(inputData) {
  let url = apiAddress + "/api/v1/mail/check";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: inputData.email,
      authNum: inputData.authNum,
    }),
  });

  switch (response.status) {
    // 인증번호 일치
    case 200:
      Toast.registerSuccess("이메일 인증에 성공했습니다.");
      break;
    // 인증번호 미일치
    case 400:
      Toast.registerError("인증번호가 일치하지 않습니다.");
      break;
    // 기타 오류
    default:
      Toast.registerError("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}

// 회원가입 요청 전송 함수
export async function action({ request }) {
  const data = await request.formData();

  const registerData = {
    name: data.get("name"),
    loginId: data.get("loginId"),
    password: data.get("password"),
    sex: data.get("sex"),
    nickName: data.get("nickName"),
    birthDay: data.get("birthDay"),
    email: data.get("email"),
  };

  let url = apiAddress + "/api/v1/members";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  switch (response.status) {
    // 인증번호 일치
    case 201:
      Toast.registerSuccess("회원가입 성공.");
      return redirect("/");
    // 인증번호 미일치
    case 400:
      Toast.registerError("잘못된 입력값이 존재합니다.");
      break;
    // 기타 오류
    default:
      Toast.registerError("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}

const INIT_ERROR_DATA = {
  email: "",
  password: "",
  confirmPassword: "",
  loginId: "",
  nickName: "",
  name: "",
  sex: "",
  birthDay: "",
};

const FOCUS_ALL_DATA = {
  email: true,
  password: true,
  confirmPassword: true,
  loginId: true,
  nickName: true,
  name: true,
  sex: true,
  birthDay: true,
};
