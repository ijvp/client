import { isAxiosError } from "axios";
import api from ".";

const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

export const fetchGoogleAdsInvestment = async (request: Request, user, store) => {
	try {
		const cookie = request.headers.get("cookie");
		const searchParams = new URL(request.url).searchParams;
		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];

		const response = await api.post("/google-ads/ads", {
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
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("failed to fetch google ads");
			return error;
		}
	}
};