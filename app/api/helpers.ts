import api from "./index";

export const checkAuth = async (request: Request) => {
	const cookie = request.headers.get("Cookie");

	console.log("COOKIE EXISTE SIM, CHEGOU NA VERIFICACAO DE AUTH", cookie)
	try {
		const response = await api.get("/auth/me", { headers: { Cookie: cookie } });
		return response.data;
	} catch (error) {
		console.log(error?.data?.message);
		return false;
	}
}