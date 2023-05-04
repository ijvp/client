import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
	baseURL: process.env.API_URL,
});

export default api;