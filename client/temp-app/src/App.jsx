import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [logs, setLogs] = useState([]);
  const [amount, setAmount] = useState("");

  const fetchLogs = async () => {
    const res = await axios.get("http://localhost:8080/api/reminder/logs");
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAdd = async () => {
    if (!amount) return;
    await axios.post("http://localhost:8080/api/reminder/log", { amount: parseInt(amount) });
    setAmount("");
    fetchLogs();
  };

  const handleUpdate = async (id) => {
    const newAmount = prompt("Enter new amount:");
    if (!newAmount) return;
    await axios.put(`http://localhost:8080/api/reminder/log/${id}`, { amount: parseInt(newAmount) });
    fetchLogs();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      await axios.delete(`http://localhost:8080/api/reminder/log/${id}`);
      fetchLogs();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>HydroReminder 💧</h1>
      <input
        type="number"
        value={amount}
        placeholder="Amount (ml)"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleAdd} style={{ marginLeft: "10px" }}>
        Add Water Intake
      </button>

      <h2 style={{ marginTop: "30px" }}>Logged Intakes</h2>
      <table border="1" cellPadding="10" style={{ marginTop: "10px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount (ml)</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.amount}</td>
              <td>{log.timestamp}</td>
              <td>
                <button onClick={() => handleUpdate(log.id)}>Update</button>
                <button onClick={() => handleDelete(log.id)} style={{ marginLeft: "10px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan="4">No logs yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
