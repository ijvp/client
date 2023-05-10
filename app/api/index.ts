import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
	baseURL: process.env.API_URL,
	withCredentials: true
});

//TODO: descobrir porque isso não ta funcionando
// atualmente é necessario passar o cookie explicitamente
// em cada loader/requisicao
api.interceptors.response.use(
	response => {
		if (response.headers['set-cookie']) {
			api.defaults.headers.common.Cookie = response.headers['set-cookie'][0];
		}
		return response;
	},
	(error) => Promise.reject(error),
);

export default api;