import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import api from "~/api";
import { checkAuth } from "~/api/helpers";

export const action = async ({ request }: ActionArgs) => {
	const authenticated = await checkAuth(request);
	const cookie = request.headers.get("Cookie");
	try {
		const response = await api.get("/auth/logout", { headers: { Cookie: cookie } });
		return redirect("/login", { headers: response.headers });
	} catch (error) {
		console.log(error.response?.data);
	};

	if (authenticated) {
		return redirect("/analysis");
	} else {
		return redirect("/logout")
	}
};

export const loader = async ({ request }: LoaderArgs) => {
	const authenticated = await checkAuth(request);
	if (authenticated) {
		return redirect("/analysis");
	} else {
		return redirect("/login");
	}
};
