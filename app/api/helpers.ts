import { isAxiosError } from "axios";
import api from "./index";

export const checkAuth = async (request: Request) => {
	const cookie = request.headers.get("Cookie");

	try {
		const response = await api.get("/auth/me", { headers: { Cookie: cookie } });
		return response.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log(error.message, error.request.path, error.response?.data)
		} else {
			console.log("Internal Server Error", error);
		}
		return false;
	}
}