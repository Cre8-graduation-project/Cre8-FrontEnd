import { Divider, Link } from "@mui/material";
import classes from "./Footer.module.css";

export default function FooterMd() {
  return (
    <footer className={`${classes.footer} ${classes.footerMd}`}>
      <div className={`${classes.footerContent} ${classes.footerContentMd}`}>
        <h1>Cre8</h1>
        <div className={`${classes.footerText} ${classes.footerTextMd}`}>
          <div className={classes.footerTopArea}>
            <p>© Cre8 - All Rights Reserved.</p>
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