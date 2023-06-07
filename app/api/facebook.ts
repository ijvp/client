import { startOfToday, endOfToday } from "date-fns";
import { parseDateString } from "~/utils/date";
import api from ".";
import { isAxiosError } from "axios";

export const fetchFacebookAdsInvestment = async (request: Request, user, store) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
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
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch facebook ads");
			return error;
		}
	}
};