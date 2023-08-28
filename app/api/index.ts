import { fetchUserStores } from '~/api/user';
import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
	baseURL: process.env.API_URL,
	withCredentials: true
});

export const authorizeIntegration = async ({ cookie, platform, store, service }) => {
	try {
		const response = await api.get(`/${platform}/authorize?store=${store}${service ? '&service=' + service : ''}`,
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

export const fetchActiveConnections = async ({ request }) => {
	const cookie = request.headers.get("cookie");
	const searchParams = new URL(request.url).searchParams;
	const store = searchParams.get("store") || await fetchUserStores(request).then(stores => stores[0].myshopify_domain)
	try {
		const response = await api.get("/user/store/connections", {
			params: { store: store },
			headers: {
				Cookie: cookie
			}
		});

		return response.data;
	} catch (error) {
		console.log("Failed to fetch store connections", error.response.data);
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
			case "google-ads":
				return res.data.map(account => { return { id: account.id, name: account.descriptive_name } });
			case "facebook":
				return res.data.map(account => { return { id: account.id, name: account.name } });

			default:
				return res.data;
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