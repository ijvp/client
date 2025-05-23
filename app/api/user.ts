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

		if (response.data.success) {
			return redirect("/analise", {
				headers: response.headers
			});
		}
	} catch (error) {
		throw error;
	}
};

export const registerUser = async (request: Request) => {
	try {
		const form = await request.formData();
		const username = form.get("username");
		const password = form.get("password");
		const confirmPassword = form.get("confirm-password");
		const searchParams = new URL(request.url).searchParams;
		const guid = decodeURIComponent(searchParams.get("guid"));

		const fields = { username, password, confirmPassword };
		if (!Object.values(fields).some(Boolean)) {
			return json({ success: false, message: "Por favor preencha todos os campos" });
		};

		if (password !== confirmPassword) {
			return json({ success: false, message: "As senhas não são iguais" });
		};

		await api.post(`/auth/register${guid ? `?guid=${encodeURIComponent(guid)}` : ""}`,
			{
				username,
				password
			},
			{
				withCredentials: true
			}
		);

		const loginResponse = await api.post("/auth/login",
			{
				username,
				password
			},
			{
				withCredentials: true
			}
		);

		if (loginResponse.data.success) {
			return redirect("/analise", {
				headers: loginResponse.headers
			});
		}
	} catch (error) {
		throw error;
	}
};