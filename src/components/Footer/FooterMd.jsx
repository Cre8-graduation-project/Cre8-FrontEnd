import { Divider, IconButton, Link } from "@mui/material";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import { useDarkMode } from "../../provider/darkModeProvider";
import classes from "./Footer.module.css";

export default function FooterMd() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <footer className={`${classes.footer} ${classes.footerMd}`}>
      <div className={`${classes.footerContent} ${classes.footerContentMd}`}>
        <div className={classes.footerTopArea}>
          <div className={classes.footerTopLogo}>
            <h1>Cre8</h1>
            <p>© All Rights Reserved.</p>
          </div>
          <IconButton onClick={toggleDarkMode}>
            {darkMode == "dark" ? <RiMoonLine /> : <RiSunLine />}
          </IconButton>
        </div>
        <div className={`${classes.footerText} ${classes.footerTextMd}`}>
          <Divider />
          <div className={`${classes.footerLinkRow} ${classes.footerLinkRowMd}`}>
            <Link color="inherit" underline="hover">Cre8 소개</Link>
            <Link color="inherit" underline="hover">이용약관</Link>
            <Link color="inherit" underline="hover">개인정보 처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}