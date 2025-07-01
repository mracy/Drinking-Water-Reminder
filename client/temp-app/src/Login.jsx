import { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) {
      setMessage("❗Please fill in all fields");
      return;
    }

    try {
      const endpoint = isRegistering ? "/register" : "/login";
      const res = await axios.post(`http://localhost:8080/api/users${endpoint}`, {
        username,
        password,
      });
      setMessage(res.data);
      if (!isRegistering) onLoginSuccess(username);
    } catch (err) {
      const errorMsg =
        err.response?.data || "Something went wrong";
      setMessage(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isRegistering ? "Register" : "Login"} 🔐</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttonRow}>
          <button onClick={handleSubmit} style={styles.buttonPrimary}>
            {isRegistering ? "Register" : "Login"}
          </button>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage("");
            }}
            style={styles.buttonSecondary}
          >
            Switch to {isRegistering ? "Login" : "Register"}
          </button>
        </div>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e0f7fa", fontFamily: "Arial" },
  card: { background: "white", padding: 30, borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", width: 300, textAlign: "center" },
  input: { width: "100%", padding: 10, margin: "10px 0", fontSize: 16, border: "1px solid #ccc", borderRadius: 6 },
  buttonRow: { display: "flex", justifyContent: "space-between", marginTop: 15 },
  buttonPrimary: { flex: 1, padding: 10, backgroundColor: "#00bcd4", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 5 },
  buttonSecondary: { flex: 1, padding: 10, backgroundColor: "#f1f1f1", color: "#333", border: "none", borderRadius: 6, cursor: "pointer", marginLeft: 5 },
  message: { marginTop: 15, color: "#d32f2f", fontSize: 14 },
};

export default Login;
