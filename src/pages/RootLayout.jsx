import { Outlet } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

import MainNavBar from "../components/MainNavBar/MainNavBar";
import Footer from "../components/Footer/Footer";
import FooterMd from "../components/Footer/FooterMd";

export default function RootLayout() {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <MainNavBar />
      <main>
        <Outlet />
      </main>
      {matchDownMd ? <FooterMd /> : <Footer />}
    </>
  );
}
