import { Divider, Link } from "@mui/material";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <h1>Cre8</h1>
        <div className={classes.footerText}>
          <div className={classes.footerTopArea}>
            <p>Copyright © Cre8 - All Rights Reserved.</p>
            <div className={classes.footerLinkRow}>
              <Link color="inherit" underline="hover">Cre8 소개</Link>
              <Link color="inherit" underline="hover">이용약관</Link>
              <Link color="inherit" underline="hover">개인정보 처리방침</Link>
            </div>
          </div>
          <Divider />
          <div className={classes.footerBottomArea}>
            
          </div>
        </div>
      </div>
    </footer>
  );
}