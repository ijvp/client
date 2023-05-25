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
import { links as sidebarLinks } from "~/components/sidebar";
import { storeIndexAtom, storesAtom } from "~/utils/atoms";


export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Integrações" }];
};

export const links: LinksFunction = () => [
	...sidebarLinks(),
	...accountSelectLinks()
];

export const action: ActionFunction = async ({ request }: ActionArgs) => {
	const cookie = request.headers.get("cookie");
	const data = await request.formData();
	const action = data.get("action")?.toString();
	const platform = data.get("platform")?.toString();
	const store = data.get("store")?.toString();
	const id = data.get("id");
	const descriptive_name = data.get("descriptive_name");

	switch (action) {
		case "authorize": {
			try {
				const redirectUrl = await authorizeIntegration({ platform, store, cookie });
				return redirect(redirectUrl);
			} catch (error) {
				console.log("failed to connect account", error)
			}
		}

		case "connect": {
			try {
				const response = await connectAccount({
					platform,
					store,
					client: { id, descriptive_name },
					cookie
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
			console.log(`Action invalid: ${action}`);
		}
	}
}

export const loader = async ({ request }: LoaderArgs) => {
	const searchParams = new URL(request.url).searchParams
	const platform = searchParams.get("platform");
	const store = searchParams.get("store");

	if (platform && store) {
		const accounts = await fetchAccounts({ store, platform, request })

		return json({
			accounts: accounts.map(account => { return { id: account.id, name: account.descriptive_name } }),
			store,
			platform
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
	const storeName = searchParams.get("store");
	const [stores] = useAtom(storesAtom);
	const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);
	const data = useLoaderData<typeof loader>();

	useEffect(() => {
		const storeIndex = stores.findIndex((store) => store.name === storeName)
		if (storeIndex !== -1) {
			setSelectedIndex(storeIndex)
		}

	}, [selectedIndex, storeName, stores, setSelectedIndex, data]);

	return (
		<>
			<PageTitle>Integrações</PageTitle>
			<IntegrationsContainer />
			{platform && (
				<AccountSelect
					{...data}
				/>
			)}
		</>
	);
};