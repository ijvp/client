import type { AxiosInstance } from "axios";
import axios from "axios";
import { Granularity } from "~/ts/enums";
import { StoreIntervalQuery } from "~/ts/types";

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

export const fetchShopifyOrders = async (params: StoreIntervalQuery, cookie: string) => {
	console.log(params);
	try {
		const response = await api.post("/shopify/orders", {
			store: params.store,
			start: params.start,
			end: params.end,
			granularity: params.granularity
		}, {
			headers: {
				Cookie: cookie
			}
		});
		return response.data;
	} catch (error) {
		console.log(error.response.data);
	}

};

export const fetchGoogleAdsInvestment = async (params: StoreIntervalQuery) => {
	const response = await api.post("/google/ads", {
		store: params.store,
		start: params.start,
		end: params.end
	});
	return response.data;
};

export const fetchProfitData = (request: Request) => {
	const cookie = request.headers.get("cookie");
	const url = new URL(request.url);
	const searchParams = url.searchParams;
	const store = searchParams.get("store");
	const start = searchParams.get("start");
	const end = searchParams.get("end");
	return "no data";
};

export default api;