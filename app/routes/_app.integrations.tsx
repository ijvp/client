import type { V2_MetaFunction, LinksFunction, LoaderArgs, ActionArgs, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { fetchAccounts, authorizeIntegration, connectAccount, disconnectIntegration } from "~/api";
import { checkAuth } from "~/api/helpers";
import AccountSelect, { links as accountSelectLinks } from "~/components/account-select";
import IntegrationsContainer from "~/components/integrations-container";
import PageTitle from "~/components/page-title";
import { links as sidebarLinks } from "~/components/sidebar-2";
import { storeIndexAtom, storesAtom } from "~/utils/atoms";


export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Integrações" }];
};

export const links: LinksFunction = () => [
	...sidebarLinks(),
	...accountSelectLinks()
];

export const action: ActionFunction = async ({ request }: ActionArgs) => {
	const data = await request.formData();
	const actionType = data.get("actionType")?.toString();
	const platform = data.get("platform")?.toString();
	const store = data.get("store")?.toString();
	const id = data.get("id");
	const descriptive_name = data.get("descriptive_name")
	const searchParams = new URL(request.url).searchParams

	switch (actionType) {
		case "authorize": {
			try {
				const response = await authorizeIntegration({
					store,
					platform
				})

				return redirect(response);
			} catch (error) {
				console.log("failed to connect account", error)
			}
		}

		case "connect": {
			try {
				const response = await connectAccount({
					store,
					platform,
					client: { id, descriptive_name },
					request
				})

				return response.message;

			} catch (error) {
				console.log("failed to connect account", error)
			}
		}

		case "disconnect": {
			try {

				const response = await disconnectIntegration({
					store,
					platform,
					request
				})

				return response;

			} catch (error) {
				console.log("failed to connect account", error)
			}
		}

		default: {
			console.log({ error: 'ActionType invalid' })
		}
	}

	return null

}

export const loader = async ({ request }: LoaderArgs) => {
	const searchParams = new URL(request.url).searchParams
	const platform = searchParams.get("platform");
	const store = searchParams.get("store");

	if (platform && store) {
		const response = await fetchAccounts({ store, platform, request })

		return json({
			response: response, store, platform
		});
	}

	const authenticated = await checkAuth(request);
	if (!authenticated) {
		return redirect("/login");
	}

	return null;
};

export default function Integrations() {
	const [searchParams] = useSearchParams()
	const platform = searchParams.get("platform");
	const callbackStore = searchParams.get("store");
	const [stores, setStores] = useAtom(storesAtom);
	const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);
	const data = useLoaderData<typeof loader>();

	useEffect(() => {
		const storeIndex = stores.findIndex((store) => store.name === callbackStore)
		if (storeIndex !== -1) {
			setSelectedIndex(storeIndex)
		}

	}, [selectedIndex, callbackStore, stores, setSelectedIndex, data]);

	return (
		<>
			<PageTitle>Integrações</PageTitle>
			<IntegrationsContainer />
			{platform && (
				<AccountSelect
					data={data}
				/>
			)}
		</>
	)
}