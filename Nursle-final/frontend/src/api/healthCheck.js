// Simple health check utility for frontend
const api = import.meta.env.VITE_API_URL;

export function checkApiHealth() {
  fetch(`${api}/health`)
    .then(res => res.json())
    .then(console.log)
    .catch(err => console.error("API error:", err));
}
