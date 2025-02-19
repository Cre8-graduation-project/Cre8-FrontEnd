import { Divider, IconButton, Link } from "@mui/material";
import classes from "./Footer.module.css";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import { useDarkMode } from "../../provider/darkModeProvider";

export default function Footer() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <h1>Cre8</h1>
        <div className={classes.footerText}>
          <div className={classes.footerTopArea}>
            <p>Copyright © Cre8 - All Rights Reserved.</p>
            <IconButton onClick={toggleDarkMode}>
              {darkMode == "dark" ? <RiMoonLine /> : <RiSunLine />}
            </IconButton>
          </div>
          <Divider />
          <div className={classes.footerBottomArea}>
            <div className={classes.footerLinkRow}>
              <Link color="inherit" underline="hover">Cre8 소개</Link>
              <Link color="inherit" underline="hover">이용약관</Link>
              <Link color="inherit" underline="hover">개인정보 처리방침</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}