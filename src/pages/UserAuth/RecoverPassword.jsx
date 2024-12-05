import { useState } from "react";
import { Form, useNavigation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import apiInstance from "../../provider/networkProvider";
import classes from "./UserAuth.module.css";

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [requestData, setRequestData] = useState({
    loginId: "",
    name: "",
    email: "",
  });
  const [helperText, setHelperText] = useState("");

  const handleChange = (e) => {
    setRequestData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendRecoverRequest(requestData).then((status) => {
      switch (status) {
        case 200:
          // 복구 성공
          setHelperText("가입 당시 사용한 이메일로 임시 비밀번호를 전송했습니다.");
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          break;
        case 400:
          // 복구 실패
          setHelperText("입력한 정보의 계정을 찾을 수 없습니다.");
          break;
        default:
          setHelperText("알 수 없는 오류가 발생했습니다.");
          break;
      }
    });
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <Form onSubmit={handleSubmit} className={classes.authForm}>
        <h2>비밀번호 복구</h2>
        <h5>복구가 필요한 계정의 정보를 입력해주세요.</h5>
        <div className={classes.authLabel}>
          <label htmlFor="loginId">아이디</label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            value={requestData.loginId || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            value={requestData.email || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.authLabel}>
          <label htmlFor="name">이름 (실명)</label>
          <input
            id="name"
            name="name"
            type="name"
            value={requestData.name || ""}
            onChange={handleChange}
            required
          />
          <p style={{ fontWeight: "bold", fontSize: "14px" }}>{helperText}</p>
        </div>
        <div className={classes.authLabel}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large" 
            disabled={isSubmitting}
            sx={{ marginTop: "1.3rem" }}
          >
            {isSubmitting ? "임시 비밀번호 요청 중" : "임시 비밀번호 전송"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// 비밀번호 초기화 요청 함수
async function sendRecoverRequest(input) {
  try {
    const response = await apiInstance.post(
      "/api/v1/mail/temp/password",
      input
    );
    return response.status;
  } catch (error) {
    // 추가 실패
    //Toast.error("요청을 전송하던 중 오류가 발생했습니다.");
    return error.response.status;
  }
}