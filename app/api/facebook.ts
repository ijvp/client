import { differenceInDays } from "date-fns";
import { parseDateString } from "~/utils/date";
import api from ".";
import { isAxiosError } from "axios";
import { Granularity } from "~/ts/enums";

const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

export const fetchFacebookAdsInvestment = async (request: Request, user, store) => {
	try {
		const cookie = request.headers.get("cookie");

		const searchParams = new URL(request.url).searchParams;
		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];
		const daysInterval = differenceInDays(parseDateString(end), parseDateString(start));

		const response = await api.post("/facebook/ad-expenses", {
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
			console.log(error.message, error.request.path, error.response?.data)
			return error.response?.data;
		} else {
			console.log("Failed to fetch facebook ads");
			return error;
		}
	}
};

export const fetchFacebookAdsInsights = async (request: Request, user, store) => {
	try {
		const cookie = request.headers.get("cookie");
		const searchParams = new URL(request.url).searchParams;
		const start = searchParams.get("start") ? searchParams.get("start") : today.toISOString().split("T")[0];
		const end = searchParams.get("end") ? searchParams.get("end") : today.toISOString().split("T")[0];

		const response = await api.post("/facebook/ad-insights", {
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
			console.log("failed to fetch facebook ads insights");
			return error;
		}
	}
}