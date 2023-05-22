import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { postShopifyStore } from "~/api";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
	const data = await request.formData();
	const url = data.get("url")?.toString();
	const accessToken = data.get("accessToken")?.toString();
	const storefrontToken = data.get("storefrontToken")?.toString();

    const response = await postShopifyStore({
        store: url,
        access_token: accessToken,
        storefront_token: storefrontToken,
        request: request
    })
	
	return response
	
}

export default function AddShopModal() {
	return (
		<></>
	)
}
