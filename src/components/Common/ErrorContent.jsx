import { Button } from "@mui/material";
import { RiErrorWarningLine } from "@remixicon/react";
import classes from './ErrorContent.module.css';
import { useNavigate } from "react-router-dom";

export default function ErrorContent({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className={classes.errorContent}>
      <div className={classes.errorTitle}>
        <RiErrorWarningLine color="black" size={40} />
        <div>
          <h1>{title}</h1>
          {children}
        </div>
      </div>
      <div className={classes.errorBtnRow}>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          뒤로 가기
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          메인 페이지로
        </Button>
      </div>
    </div>
  );
}