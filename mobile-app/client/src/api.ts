const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export async function apiRequest(
  method: string,
  path: string,
  body?: any
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}