import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import api from "~/api";

export const action = async ({ request }: ActionArgs) => {
	try {
		const cookie = request.headers.get("cookie");
		const body = await request.formData();
		const store = String(body.get("store"));

		await api.delete(`/user/store?store=${store}`, {
			headers: {
				Cookie: cookie
			}
		});
		return json({ success: true, message: "Loja deletada" });
	} catch (error) {
		return json({ success: false, error: "Erro ao tentar deletar loja" });
	};
};