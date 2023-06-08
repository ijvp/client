import api from ".";
import { isAxiosError } from "axios";

export const fetchUserStores = async (request: Request) => {
	try {
		const cookie = request.headers.get("cookie");

		const response = await api.get("/user/stores", {
			headers: {
				Cookie: cookie
			}
		})

		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data);
			throw new Error(error.response?.data);
		} else {
			console.log("failed to fetch user stores");
			throw new Error(error);
		}
	}
}