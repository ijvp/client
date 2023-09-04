import { parseDateString } from '~/utils/date';
import { isAxiosError } from "axios";
import { differenceInDays } from "date-fns";
import { Granularity } from "~/ts/enums";
import api from ".";
import { StoreData } from '~/ts/types';
import { fetchUserStores } from './user';

const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

export const fetchShopifyRedirectURI = async (request: Request) => {
	try {
		const cookie = request.headers.get("cookie");

		const response = await api.get("/shopify/authorize", {
			headers: {
				Cookie: cookie
			}
		});

		return response.data;
	} catch (error) {
		console.log("Failed to fetch shopify redirect URI", error.response.data);
	}
};

export const fetchShopifyOrders = async (request: Request, user, store) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];
		const daysInterval = differenceInDays(parseDateString(end), parseDateString(start));

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
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data);
			return error.response?.data
		} else {
			console.log("failed to fetch shopify orders");
			return error
		}
	}
};

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

export const fetchShopifyProducts = async (request, user, store) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const response = await api.get("/shopify/products", {
			headers: { Cookie: cookie },
			params: {
				store
			},
		});

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch shopify products", error);
			return error;
		}
	}
};

export const fetchShopifyProductById = async (request, user, productId) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || await fetchUserStores(request).then(stores => stores[0].myshopify_domain)
		const response = await api.get("/shopify/product",
			{
				headers: { Cookie: cookie },
				params: {
					store: store,
					productId: productId
				}
			});

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch shopify product", productId);
			return error;
		}
	}
};

export const fetchProductsSessions = async (request, user, productId) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || await fetchUserStores(request).then(stores => stores[0].myshopify_domain)

		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];

		const response = await api.get("/google-analytics/product-sessions",
			{
				headers: { Cookie: cookie },
				params: {
					store: store,
					productId: productId,
					start: start,
					end: end
				}
			});

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch shopify product", productId);
			return error;
		}
	}
};

export const fetchProductSessionsById = async (request, user, productId) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || await fetchUserStores(request).then(stores => stores[0].myshopify_domain)

		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];

		const response = await api.get(`/google-analytics/product-sessions/${productId}`,
			{
				headers: { Cookie: cookie },
				params: {
					store: store,
					start: start,
					end: end
				}
			});

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch shopify product", productId);
			return error;
		}
	}
};

export const fetchProductOrders = async (request, user, productId) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || await fetchUserStores(request).then(stores => stores[0].myshopify_domain)

		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];

		const response = await api.post("/shopify/product-orders",
			{
				store: store,
				productId: productId,
				start: start,
				end: end
			},
			{
				headers: { Cookie: cookie },
			});

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch shopify product", productId);
			return error;
		}
	}
};
