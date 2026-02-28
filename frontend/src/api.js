const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}
