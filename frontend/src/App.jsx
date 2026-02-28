import { useState, useEffect } from "react";
import { getStatus } from "./api";

export default function App() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStatus()
      .then(setStatus)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>Pipeline check</h1>
        <p style={{ color: "#666" }}>Add your pages and features below.</p>
      </header>

      <section>
        {error && (
          <p style={{ color: "crimson" }}>
            Backend says: Error — {error}
          </p>
        )}
        {status && (
          <p>
            Backend says: status = {status.status}, database = {status.database}.
          </p>
        )}
        {!status && !error && <p>Loading…</p>}
      </section>
    </div>
  );
}
