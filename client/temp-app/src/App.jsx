import { useState } from "react";
import Login from "./Login";
import WaterApp from "./WaterApp";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("username"));

  const handleLogin = (username) => {
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <WaterApp onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLogin} />
  );
}

export default App;
