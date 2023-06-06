import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { fetchShopifyRedirectURI, postShopifyStore } from "~/api/shopify";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
	const redirectPath = new URL(request.headers.get("referer")).pathname;

	try {
		const response = await fetchShopifyRedirectURI(request);
		return response;
	} catch (error) {
		console.log(error);
		return null;
	}
};
