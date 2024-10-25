import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDarkMode } from './provider/darkModeProvider';
import AuthProvider from "./provider/authProvider";
import NotificationProvider from "./provider/notificationProvider";
import Routes from "./routes/Routes";

function App() {
  const { darkMode } = useDarkMode();

  const theme = createTheme({
    cssVariables: true,
    palette: {
      mode: darkMode,
      primary: {
        main: darkMode === "light" ? '#673AB7' : '#673AB7',
      },
      secondary: {
        main: '#F39C12',
      },
      divider: darkMode === "light" ? "#979797" : "#8a8a8a",
      background: {
        paper: darkMode === "light" ? "#ffffff" : "#1f1f1f",
        default: darkMode === "light" ? "#ffffff" : "#1f1f1f",
      }
    },
    typography: {
      "fontFamily": 'Pretendard, system-ui, Helvetica, Arial, sans-serif'
    },
  });

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Routes />
          <ToastContainer pauseOnFocusLoss={false}/>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;