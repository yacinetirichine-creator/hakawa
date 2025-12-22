import axios from "axios";
import { supabase } from "./supabase";

const stripTrailingSlash = (value) => (value ? value.replace(/\/+$/, "") : "");

// We expect backend routes to live under `/api/*` (Vercel rewrite → Railway).
// - In prod, prefer same-origin `/api`.
// - In dev, default to local backend `http://localhost:8000/api`.
const API_ORIGIN = stripTrailingSlash(import.meta.env.VITE_API_URL);
const API_BASE_URL = API_ORIGIN
  ? `${API_ORIGIN}/api`
  : import.meta.env.DEV
  ? "http://localhost:8000/api"
  : "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
