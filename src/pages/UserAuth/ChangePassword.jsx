import { useState, useEffect } from "react";
import {
  Form,
  useNavigation,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button } from "@mui/material";

import { Toast } from "../../components/Common/Toast";
import { useAuth } from "../../provider/authProvider";
import UserValidate from "../../provider/UserValidate";
import apiInstance from "../../provider/networkProvider";
import classes from "./UserAuth.module.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const isTempPassword = location.state?.isTempPassword || false;
  const isSubmitting = navigation.state === "submitting";

  const [requestData, setRequestData] = useState({
    password: "",
    newPassword: "",
  });
  const [focus, setFocus] = useState({});
  const [changePasswordError, setChangePasswordError] = useState({});
  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    setChangePasswordError(UserValidate(requestData, "changePassword"));
  }, [requestData, focus]);

  const handleFocus = (e) => {
    setFocus({ ...focus, [e.target.name]: true });
  };

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
    let passwordErrorObject = {};
    if (isTempPassword) {
      if(changePasswordError.newPassword) {
        passwordErrorObject.newPassword = changePasswordError.newPassword;
      }
    } else {
      passwordErrorObject = changePasswordError;
    }

    if (Object.keys(passwordErrorObject).length) {
      // 입력값 오류가 한 개 이상 발견 시
      Toast.error("입력하신 내용들을 다시 확인해주세요!");
      setFocus(FOCUS_ALL_DATA);
    } else {
      sendPasswordChangeRequest(requestData, isTempPassword).then((status) => {
        switch (status) {
          case 200:
            // 변경 성공
            setHelperText("비밀번호가 변경되었습니다.");
            setTimeout(() => {
              logout();
              navigate("/");
            }, 3000);
            break;
          case 404:
            // 변경 실패
            setHelperText("잘못된 값이 입력되었습니다.");
            break;
          default:
            setHelperText("알 수 없는 오류가 발생했습니다.");
            break;
        }
      });
    }
  };

  return (
    <div className={`center ${classes.authPage}`}>
      <Form onSubmit={handleSubmit} className={classes.authForm}>
        <h2>비밀번호 변경</h2>
        <h5>새 비밀번호를 입력해주세요.</h5>
        <div className={classes.authLabel}>
          {!isTempPassword && (
            <>
              <label htmlFor="password">이전 비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                value={requestData.password || ""}
                onChange={handleChange}
                onFocus={handleFocus}
                required
              />
              {changePasswordError.password && focus.password && (
                <p>{changePasswordError.password}</p>
              )}
            </>
          )}
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={requestData.newPassword || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            required
          />
          {changePasswordError.newPassword && focus.newPassword && (
            <p>{changePasswordError.newPassword}</p>
          )}
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
            {isSubmitting ? "비밀번호 변경 중" : "비밀번호 변경"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// 비밀번호 초기화 요청 함수
async function sendPasswordChangeRequest(input, isTempPassword) {
  const inputData = isTempPassword
    ? { newPassword: input.newPassword }
    : { oldPassword: input.password, newPassword: input.newPassword };

  try {
    const response = await apiInstance.patch(
      isTempPassword
        ? "/api/v1/members/tmp/passwords"
        : "/api/v1/members/passwords",
      inputData
    );
    return response.status;
  } catch (error) {
    //console.error("Password change request failed:", error);
    return error.response?.status || 500;
  }
}

const FOCUS_ALL_DATA = {
  password: true,
  newPassword: true,
};