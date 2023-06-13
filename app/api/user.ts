import { json, redirect } from "@remix-run/node";
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
			console.error(error.message, error.request.path, error.response?.data);
			throw new Error(error.response?.data);
		} else {
			console.error("failed to fetch user stores");
			throw new Error(error);
		}
	}
};

export const loginUser = async (request: Request) => {
	try {
		const form = await request.formData();
		const username = form.get("username");
		const password = form.get("password");

		const fields = { username, password };
		if (!Object.values(fields).some(Boolean)) {
			return json({ success: false, message: "Por favor preencha todos os campos" });
		};

		const response = await api.post("/auth/login",
			{
				username,
				password
			},
			{
				withCredentials: true
			}
		);
		console.log("headers", response.headers);
		if (response.data.success) {
			return redirect("/analysis", {
				headers: response.headers
			});
		}
	} catch (error) {
		if (isAxiosError(error)) {
			console.error(error.message, error.request.path, error.response?.data);
			throw new Error(error.response?.data);
		} else {
			console.error("failed to authenticate user");
			throw new Error(error);
		}
	}
}