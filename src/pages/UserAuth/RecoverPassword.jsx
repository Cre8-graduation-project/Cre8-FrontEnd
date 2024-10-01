import { useState } from "react";
import { Form, useNavigation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Toast } from "../../components/Common/Toast";
import classes from "./UserAuth.module.css";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function LoginPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // 사용자 입력 정보
  const [requestData, setRequestData] = useState({
    email: "",
  });

  // 사용자 입력 event handler
  // - 사용자 입력 데이터 저장
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

    const response = await sendRecoverRequest(requestData);
    switch (response.status) {
      case 201:
        // 복구 성공
        Toast.success("기입하신 이메일로 임시 비밀번호를 전송했습니다.");
        break;
      case 400:
        // 복구 실패
        Toast.error("?.");
        break;
      default:
        Toast.error("알 수 없는 오류가 발생했습니다.");
        break;
    }
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <Form onSubmit={handleSubmit} className={classes.authForm}>
        <h2>비밀번호 복구</h2>
        <h5>가입 당시 사용한 이메일 주소를 입력해주세요.</h5>
        <div className={classes.authLabel}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            value={requestData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.authLabel}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large" 
            sx={{ marginTop: "2rem" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "임시 비밀번호 요청 중" : "임시 비밀번호 전송"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// 로그인 요청 함수
async function sendRecoverRequest(inputData) {
  let url = apiAddress + "/api/v1/?";

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
