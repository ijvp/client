import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { postShopifyStore } from "~/api/shopify";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
	const redirectPath = new URL(request.headers.get("referer")).pathname
	const data = await request.formData();
	const url = data.get("url")?.toString();
	const accessToken = data.get("accessToken")?.toString();
	const storefrontToken = data.get("storefrontToken")?.toString();

	try {
		const response = await postShopifyStore({
			store: url,
			access_token: accessToken,
			storefront_token: storefrontToken,
			request: request
		});

		if (response.success) {
			return json({ success: true, redirectUrl: `${redirectPath}?store=${url}` });
		} else {
			return json(response);
		}
	} catch (error) {
		console.log("error", error);
		return json({ success: false, message: "Algo deu errado, tente novamente" })
	}
};
