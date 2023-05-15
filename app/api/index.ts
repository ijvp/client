import type { AxiosInstance } from "axios";
import axios from "axios";
import { endOfToday, startOfToday } from "date-fns";
import { Granularity } from "~/ts/enums";
import { StoreIntervalQuery } from "~/ts/types";
import { parseDateString } from "~/utils/date";

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

export const fetchShopifyOrders = async (request: Request, user) => {
	try {
		const cookie = request.headers.get("cookie");
		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || user.shops[0].name;
		const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startOfToday();
		const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endOfToday();

		const response = await api.post("/shopify/orders", {
			store,
			start,
			end,
			granularity: Granularity.Hour
		}, {
			headers: {
				Cookie: cookie
			}
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error.data);
	}
};

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