import { useState, useEffect } from "react";
import {
  Form,
  useNavigation,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button, ButtonBase } from "@mui/material";

import { Toast } from "../../components/Common/Toast";
import { useAuth } from "../../provider/authProvider";
import UserValidate from "../../provider/UserValidate";
import apiInstance from "../../provider/networkProvider";
import classes from "./UserAuth.module.css";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const isSubmitting = navigation.state === "submitting";
  const [isFirstBtnClicked, setIsFirstBtnClicked] = useState(false);

  const handleFirstBtnClick = (e) => {
    e.preventDefault();
    setIsFirstBtnClicked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    sendDeleteAccountRequest().then((status) => {
      switch (status) {
        case 200:
          // 삭제 성공
          Toast.success(
            "계정이 삭제되었습니다. 지금까지 Cre8을 이용해주셔서 감사합니다."
          );
          setTimeout(() => {
            logout();
            navigate("/");
          }, 3000);
          break;
        default:
          // 삭제 실패
          Toast.error("알 수 없는 오류가 발생했습니다.");
          break;
      }
    });
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <Form onSubmit={handleSubmit} className={classes.authForm}>
        <h2>회원 탈퇴</h2>
        <h5>Cre8 계정 정보를 삭제하고 회원에서 탈퇴합니다.</h5>
        <h5>탈퇴 신청이 제출되고 나면, 다시는 되돌릴 수 없습니다!</h5>
        <div className={classes.authLabel}>
          <Button
            variant="contained"
            color={isFirstBtnClicked ? "inherit" : "primary"}
            size="large"
            disabled={isSubmitting}
            onClick={handleFirstBtnClick}
            sx={{ marginTop: "1rem" }}
          >
            {isSubmitting ? "회원 탈퇴 중" : "회원 탈퇴"}
          </Button>
          {isFirstBtnClicked && (
            <>
              <h4>정말로 탈퇴하시겠습니까?</h4>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? "회원 탈퇴 중" : "네"}
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
  );
}

// 비밀번호 초기화 요청 함수
async function sendDeleteAccountRequest() {
  try {
    const response = await apiInstance.delete("/api/v1/members");
    return response.status;
  } catch (error) {
    //console.error("Password change request failed:", error);
    return error.response?.status || 500;
  }
}
