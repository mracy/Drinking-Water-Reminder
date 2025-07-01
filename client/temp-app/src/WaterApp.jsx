import { useEffect, useState } from "react";
import axios from "axios";

function WaterApp({ onLogout }) {
  const [logs, setLogs] = useState([]);
  const [amount, setAmount] = useState("");
  const username = localStorage.getItem("username");

  // Ask for notification permission on mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Function to show notification
  const sendNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("💧 Time to drink water!", {
        body: "Stay hydrated. It's time to take a sip!",
        icon: "https://cdn-icons-png.flaticon.com/512/728/728093.png",
      });
    }
  };

  // Schedule notification every 15–25 minutes
  useEffect(() => {
    let timeout;

    const scheduleNotification = () => {
      const delay = 20 * 60 * 1000; // 

      timeout = setTimeout(() => {
        sendNotification();
        scheduleNotification(); // Schedule next notification
      }, delay);
    };

    if (username) {
      scheduleNotification();
    }

    return () => clearTimeout(timeout);
  }, [username]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/reminder/logs/${username}`);
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAdd = async () => {
    if (!amount) return;
    await axios.post(`http://localhost:8080/api/reminder/log`, {
      username,
      amount: parseInt(amount),
    });
    setAmount("");
    fetchLogs();
  };

  const handleUpdate = async (id) => {
    const newAmount = prompt("Enter new amount:");
    if (!newAmount) return;
    await axios.put(`http://localhost:8080/api/reminder/log/${id}`, {
      amount: parseInt(newAmount),
    });
    fetchLogs();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      await axios.delete(`http://localhost:8080/api/reminder/log/${id}`);
      fetchLogs();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={styles.heading}>HydroReminder 💧</h1>
          <button onClick={onLogout} style={styles.logout}>Logout</button>
        </div>
        <div style={styles.form}>
          <input
            type="number"
            value={amount}
            placeholder="Amount (ml)"
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAdd} style={styles.button}>Add Water Intake</button>
        </div>

        <h2 style={styles.subHeading}>Logged Intakes</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Amount (ml)</th>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} style={styles.tr}>
                  <td style={styles.td}>{log.id}</td>
                  <td style={styles.td}>{log.amount}</td>
                  <td style={styles.td}>{log.timestamp}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleUpdate(log.id)} style={styles.actionButton}>Update</button>
                    <button onClick={() => handleDelete(log.id)} style={{ ...styles.actionButton, backgroundColor: "#f44336" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.td}>No logs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e0f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    padding: 20,
  },
  card: {
    width: "90%",
    maxWidth: 800,
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  heading: { color: "#00796b" },
  subHeading: { marginTop: 30, color: "#00796b" },
  form: { display: "flex", gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00bcd4",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    backgroundColor: "#00acc1",
    color: "#fff",
    padding: 10,
    textAlign: "left",
    borderBottom: "2px solid #ccc",
  },
  tr: { borderBottom: "1px solid #ddd" },
  td: { padding: 10 },
  actionButton: {
    padding: "6px 12px",
    marginRight: 5,
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  logout: {
    padding: "8px 16px",
    backgroundColor: "#ff5722",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default WaterApp;
