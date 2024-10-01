import { useState } from "react";
import { useAuth } from "../../provider/authProvider.jsx";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function LoginTest() {
  const { token, reissueToken, setToken } = useAuth();

  const [loginMessage, setLoginMessage] = useState("");

  const handleClick = async () => {
    let url = apiAddress + "/api/v1/test/login";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const resText = await response.text();
    if(response.status === 200) {
      setLoginMessage(resText);
    } else {
      setLoginMessage("Authorization Failed");
    }
  }

  const handleReIssue = () => {
    reissueToken();
  }

  const handleRemoveToken = () => {
    setToken("");
  }

  return (
    <section id="test-section">
      <h3>Login Test Section</h3>
      <div>
        <p>{loginMessage}</p>
      </div>
      <button onClick={handleClick}>확인</button>
      <button onClick={handleReIssue}>토큰 재발급</button>
      <button onClick={handleRemoveToken}>액세스 토큰 삭제</button>
    </section>
  );
}