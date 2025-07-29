// PUBLIC_INTERFACE
/**
 * Utility module for backend API communication.
 *
 * Uses REACT_APP_API_BASE or fallback for localhost:5000.
 * All endpoints expect a REST-style API.
 */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function makeUrl(endpoint) {
  return `${API_BASE}${endpoint}`;
}

// PUBLIC_INTERFACE
export async function apiRequest({ endpoint, method = "GET", data, token }) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(makeUrl(endpoint), options);
  if (response.status === 401) throw new Error("Unauthorized");
  if (!response.ok) throw new Error(`API error: ${response.statusText}`);
  return await response.json();
}
