import type { V2_MetaFunction, LinksFunction, LoaderArgs, ActionArgs, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Await, useLoaderData, useSearchParams } from "@remix-run/react";
import { useAtom } from "jotai";
import { Suspense, useEffect } from "react";
import { fetchAccounts, authorizeIntegration, connectAccount, disconnectIntegration, fetchActiveConnections } from "~/api";
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
	const name = data.get("name");

	switch (action) {
		case "authorize": {
			try {
				const redirectUrl = await authorizeIntegration({ cookie, platform, store });
				console.log(redirectUrl);
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
					account: { id, name },
					cookie
				})

				return response;
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
			return null;
		}
	}
}

export function ErrorBoundary() {
	return (
		<PageTitle>Erro ao carregar integrações</PageTitle>
	)
};

export const loader = async ({ request }: LoaderArgs) => {
	const user = await checkAuth(request);
	if (!user) {
		return redirect("/login");
	}

	const searchParams = new URL(request.url).searchParams
	const platform = searchParams.get("platform");
	const store = searchParams.get("store");

	const connections = await fetchActiveConnections({ request });
	if (platform && store) {
		const accounts = await fetchAccounts({ store, platform, request })

		return json({
			accounts,
			store,
			platform,
			connections
		});
	} else {
		return json({ connections })
	}
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

	console.log("LOADER DATA", data);
	return (
		<>
			<PageTitle>Integrações</PageTitle>
			<Suspense>
				<Await
					resolve={data?.connections}
					errorElement={<h2 className="h4 my-12">Parece que algo deu errado, tente buscar dados de outro periodo ou recarregue a página</h2>}
				>
					<IntegrationsContainer connections={data?.connections} />
				</Await>
			</Suspense>
			{platform && (
				<AccountSelect
					{...data}
				/>
			)}
		</>
	);
};