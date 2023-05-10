import api from "./index";

export const checkAuth = async (request: Request) => {
	const cookie = request.headers.get("Cookie");

	try {
		await api.get("/auth/me", { headers: { Cookie: cookie } });
		return true;
	} catch (error) {
		console.log(error.response.data);
		return false;
	}
}