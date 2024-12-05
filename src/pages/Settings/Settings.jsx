import { useNavigate } from "react-router-dom";
import { Card, Divider, Button } from "@mui/material";
import TitleBar from "../../components/Common/TitleBar";
import classes from "./Settings.module.css";

export default function SettingsPage() {
  const navigate = useNavigate();

  const SettingsMenuTab = ({ title, desc, children }) => {
    return (
      <div className={classes.settingsMenuTab}>
        <div className={classes.settingsMenuTabTop}>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
        <div className={classes.settingsMenuTabBottom}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.settingsContent}>
      <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
        <TitleBar title="계정 설정" />
        <Divider />
        <SettingsMenuTab
          title="비밀번호 변경"
          desc="현재 사용 중인 비밀번호를 변경할 수 있습니다."
        >
          <Button
            variant="contained"
            onClick={() => {
              navigate("/changePassword");
            }}
          >
            비밀번호 변경
          </Button>
        </SettingsMenuTab>
        <SettingsMenuTab
          title="회원 탈퇴"
          desc="Cre8 계정을 삭제하고 회원에서 탈퇴할 수 있습니다."
        >
          <Button
            variant="contained"
            onClick={() => {
              navigate("/deleteAcc");
            }}
          >
            회원 탈퇴
          </Button>
        </SettingsMenuTab>
      </Card>
    </div>
  );
}
