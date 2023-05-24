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
import { storesAtom, userAtom } from "~/utils/atoms";
import { useEffect } from "react";

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export const loader = async ({ request }: LoaderArgs) => {
	const { username, shops } = await checkAuth(request);

	return { username, stores: shops };
};

export default function App() {
	const data = useLoaderData();
	const [, setStores] = useAtom(storesAtom);
	const [, setUser] = useAtom(userAtom);

	useEffect(() => {
		if (data.stores) {
			setStores(data.stores);
		}

		if (data.username) {
			setUser(data.username)
		}
	}, [data, setStores, setUser]);

	return (
		<AppProvider i18n={{ ...en, ...ptBR }}>
			<Sidebar />
			<div className="p-6 md:p-10 lg:p-16 xl:p-20 w-full">
				<Outlet />
			</div>
		</AppProvider>
	)
}
