import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import en from '@shopify/polaris/locales/en.json';
import ptBR from '@shopify/polaris/locales/pt-BR.json';
import { Outlet, useLoaderData } from "@remix-run/react";
import Sidebar, {
	links as sidebarLinks
} from "~/components/sidebar";
import { checkAuth } from "~/api/helpers";
import { useAtom } from "jotai";
import { storesAtom } from "~/utils/atoms";
import { useEffect } from "react";

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export const loader = async ({ request }: LoaderArgs) => {
	const { shops } = await checkAuth(request);
	return { stores: shops };
};

export default function App() {
	const data = useLoaderData();
	const [, setStores] = useAtom(storesAtom);

	useEffect(() => {
		if (data.stores) {
			setStores(data.stores);
		}
	}, [data.stores]);

	return (
		<AppProvider i18n={{ ...en, ...ptBR }}>
			<Sidebar />
			<div className="p-20 h-full w-full">
				<Outlet />
			</div>
		</AppProvider>
	)
}
