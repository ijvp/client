import api from "./index";

export const checkAuth = async (request: Request) => {
	const cookie = request.headers.get("Cookie");

	try {
		const response = await api.get("/auth/me", { headers: { Cookie: cookie } });
		return response.data;
	} catch (error) {
		console.log(error?.data?.message);
		return false;
	}
}