import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const clientId = Math.random().toString(36).substring(7);

export default function App() {
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.stage === "done") {
        setResult(data);

        if (data.verdict === "DANGEROUS") {
          alert("🚨 Dangerous APK detected!");
        }
      } else {
        setLogs((prev) => [...prev, data.msg]);
      }
    };
  }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    setLogs([]);
    setResult(null);

    await fetch(`http://localhost:8000/scan?client_id=${clientId}`, {
      method: "POST",
      body: form,
    });
  };

  return (
    <div className="min-h-screen p-10">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl mb-6"
      >
        🛡️ APK Guardian
      </motion.h1>

      <motion.input
        whileHover={{ scale: 1.1 }}
        type="file"
        accept=".apk"
        onChange={upload}
        className="mb-6"
      />

      <div>
        {logs.map((log, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚡ {log}
          </motion.p>
        ))}
      </div>

      {result && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-6 p-4 border border-green-400"
        >
          <h2 className="text-2xl">🚨 {result.verdict}</h2>
          <p>Score: {result.score}</p>

          {result.reasons.map((r, i) => (
            <p key={i}>⚠️ {r}</p>
          ))}
        </motion.div>
      )}
    </div>
  );
}