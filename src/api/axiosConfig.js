import axios from "axios";

const instance = axios.create({
  baseURL: "https://66aa-2800-e2-1100-f43-b840-537b-aa8d-d24d.ngrok-free.app",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;