// api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE = "http://192.168.18.5:8000"; // <-- change if your backend host differs

async function getToken() {
  try {
    return await AsyncStorage.getItem("token");
  } catch (err) {
    console.warn("getToken error", err);
    return null;
  }
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || res.statusText;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export default {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
  rawRequest: request,
  BASE,
};
