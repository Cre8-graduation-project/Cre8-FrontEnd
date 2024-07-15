import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";

import RootLayout from "../pages/RootLayout.jsx";
import HomePage from "../pages/Home.jsx";
import RecruitPage from "../pages/Recruit/Recruit.jsx";
import JobPage from "../pages/Job.jsx";
import CommunityPage from "../pages/Community.jsx";
import LoginPage from "../pages/UserAuth/Login.jsx";
import RegisterPage, { action as registerAction } from "../pages/UserAuth/Register.jsx";
import RecoverPasswordPage from "../pages/UserAuth/RecoverPassword.jsx";
import ProfilePage, { profileLoader } from "../pages/Profile/Profile.jsx";
import ProfileEditPage from "../pages/Profile/ProfileEdit.jsx";
import PortfolioPage, { portfolioLoader } from "../pages/Portfolio/Portfolio.jsx";
import PortfolioEditPage from "../pages/Portfolio/PortfolioEdit.jsx";
import ErrorPage from "../pages/Error.jsx";
import TestPage from "../pages/Test.jsx";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    { index: true, element: <HomePage /> },
    {
      path: "recruit",
      element: <RecruitPage />,
      children: [{}],
    },
    {
      path: "job",
      element: <JobPage />,
      children: [{}],
    },
    {
      path: "community",
      element: <CommunityPage />,
      children: [{}],
    },
    {
      path: "p/:userID",
      id: "profile-page",
      loader: profileLoader,
      children: [
        {
          index: true,
          element: <ProfilePage />,
        },
        {
          path: ":portfolioID",
          id: "portfolio-page",
          loader: portfolioLoader,
          element: <PortfolioPage />,
        },
      ],
    },
    { path: "register", element: <RegisterPage />, action: registerAction },
    { path: "test", element: <TestPage /> },
  ];

  // Accessible only to authenticated users
  // non-authenticated users will redirected to login page.
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrapped in ProtectedRoute
      children: [
        {
          path: "logout",
          element: <div>Logout</div>,
        },
        {
          path: "p/:userID",
          id: "profile-page-edit",
          loader: profileLoader,
          children: [
            {
              path: "edit",
              element: <ProfileEditPage />,
            },
            {
              path: "edit/:portfolioID",
              id: "portfolio-page-edit",
              loader: portfolioLoader,
              element: <PortfolioEditPage />,
            },
          ],
        },
      ],
    },
  ];

  // Accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    { path: "login", element: <LoginPage /> },
    { path: "recoverPassword", element: <RecoverPasswordPage /> },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
      ],
    },
  ]);

  // Final Router Configuration
  return <RouterProvider router={router} />;
};

export default Routes;
