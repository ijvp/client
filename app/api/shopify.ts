import { isAxiosError } from "axios";
import { startOfToday, endOfToday, differenceInDays } from "date-fns";
import { Granularity } from "~/ts/enums";
import { parseDateString } from "~/utils/date";
import api from ".";

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

export const fetchShopifyProducts = async (request, user) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || user.shops[0].name;
		const response = await api.post("/shopify/most-wanted", {
			store: store
		}, { headers: { Cookie: cookie } });

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch shopify products");
			return error;
		}
	}
};

export const fetchShopifyProductById = async (request, user, productId) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const store = searchParams.get("store") || user.shops[0].name;
		const response = await api.post("/shopify/product", {
			store: store,
			productId: `gid://shopify/Product/${productId}`
		}, { headers: { Cookie: cookie } });

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
}