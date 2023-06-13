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
			console.log("INTERCEPTED", response.headers['set-cookie']);
			const cookies = response.headers['set-cookie'].join('; ');
			console.log("COOKIES", cookies);
			api.defaults.headers.common.Cookie = cookies;
		}
		return response;
	},
	(error) => Promise.reject(error),
);

export const authorizeIntegration = async ({ platform, store, cookie }) => {
	try {
		const response = await api.get(`/${platform}/authorize?store=${store}`,
			{
				headers:
				{
					Cookie: cookie
				}
			});

		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const fetchAccounts = async ({ platform, store, request }: IConnectIntegration) => {
	const cookie = request.headers.get("cookie");
	try {
		const res = await api.get(`/${platform}/accounts`, {
			params: {
				store: store
			},
			headers: {
				Cookie: cookie
			}
		});

		switch (platform) {
			case "google":
				return res.data.map(account => { return { id: account.id, name: account.descriptive_name } });

			case "facebook":
				return res.data.map(account => { return { id: account.id, name: account.name } });

			default:
				return [];
		};
	} catch (error) {
		if (error.response) {
			console.log('error', error.response.data);
		} else {
			console.log('error', error);
		}

	}
};

export const connectAccount = async ({ platform, store, account, cookie }) => {
	try {
		const res = await api.post(`/${platform}/account/connect`, {
			store,
			account
		}, {
			headers: {
				Cookie: cookie
			}
		});

		return res.data;
	} catch (error) {
		console.log("failed to connect", platform, "account", error.response?.data);
	}
};

export const disconnectIntegration = async ({ store, platform, request }: IAuthorizeIntegration) => {
	const cookie = request.headers.get("cookie");

	try {
		const res = await api.get(`/${platform}/account/disconnect?store=${store}`, {
			headers: {
				Cookie: cookie
			}
		});
		// 204 no content
		return res.data
	} catch (error) {
		console.log('error', error);
	}
};

export default api;