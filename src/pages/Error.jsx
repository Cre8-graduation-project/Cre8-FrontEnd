import { useRouteError } from "react-router-dom";
import { Card, useTheme, useMediaQuery } from "@mui/material";

import ErrorContent from "../components/Common/ErrorContent";
import MainNavBar from "../components/MainNavBar/MainNavBar";
import Footer from "../components/Footer/Footer";
import FooterMd from "../components/Footer/FooterMd";

function ErrorPage() {
  const error = useRouteError();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  let title = "An error occured!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }

  return (
    <>
      <MainNavBar />
      <main>
        <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
          <ErrorContent title={title}>
            <p>{message}</p>
          </ErrorContent>
        </Card>
      </main>
      {matchDownMd ? <FooterMd /> : <Footer />}
    </>
  );
}

export default ErrorPage;
