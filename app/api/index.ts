import type { AxiosInstance } from "axios";
import axios from "axios";
import { differenceInDays, endOfToday, startOfToday } from "date-fns";
import { Granularity } from "~/ts/enums";
import { parseDateString } from "~/utils/date";

const api: AxiosInstance = axios.create({
	//baseURL: "http://localhost:8080",    
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

export const fetchShopifyOrders = async (request: Request, user) => {
	try {
		const cookie = request.headers.get("cookie");
		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || user.shops[0].name;
		const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startOfToday();
		const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endOfToday();
		const daysInterval = differenceInDays(end, start);

		const response = await api.post("/shopify/orders", {
			store,
			start,
			end,
			granularity: daysInterval > 0 ? Granularity.Day : Granularity.Hour
		}, {
			headers: {
				Cookie: cookie
			}
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data
		} else {
			return error
		}
	}
};

interface IAuthorizeIntegration {
	store: string;
	platform: string;
	request: Request
}

export const authorizeIntegration = async ({ store, platform }: IAuthorizeIntegration) => {
	try {
		const res = await api.get(`/${platform}/authorize?store=${store}`);

		return res.data
	} catch (error) {
		console.log('error', error);
	}
}

interface IConnectIntegration {
	platform: string;
	store: string;
	client?: {
		id: string,
		descriptive_name: string
	}
	request?: Request
}

export const fetchAccounts = async ({ platform, store, request }: IConnectIntegration) => {
	if (!request) return ({ error: 'request missing' })
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

		return res.data
	} catch (error) {
		if (error.response) {
			console.log('error', error.response.data);
		} else {
			console.log('error', error);
		}

	}
}

export const connectAccount = async ({ platform, store, client, request }: IConnectIntegration) => {
	const cookie = request.headers.get("cookie");

	try {
		const res = await api.post(`/${platform}/account/connect`, {
			store,
			client
		}, {
			headers: {
				Cookie: cookie
			}
		});

		return res.data
	} catch (error) {
		console.log("failed to connect", platform, "account");
	}
}

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
}

export const postShopifyStore = async (params: StoreData) => {
	try {
		const cookie = params.request.headers.get("cookie");
		const response = await api.post("/shopify/connect", {
			store: params.store,
			access_token: params.access_token,
			storefront_token: params.storefront_token
		}, {
			headers: {
				Cookie: cookie
			}
		});

		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data
		} else {
			return error
		}
	}
}

export const fetchGoogleAdsInvestment = async (request: Request, user) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || user.shops[0].name;
		const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startOfToday();
		const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endOfToday();

		const response = await api.post("/google/ads", {
			store,
			start,
			end
		}, {
			headers: {
				Cookie: cookie
			}
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const fetchFacebookAdsInvestment = async (request: Request, user) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || user.shops[0].name;
		const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startOfToday();
		const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endOfToday();

		const response = await api.post("/facebook/ads", {
			store,
			start,
			end
		}, {
			headers: {
				Cookie: cookie
			}
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export default api;