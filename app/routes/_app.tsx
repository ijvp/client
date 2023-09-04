import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
import { useEffect, useState } from "react";
import { fetchUserStores } from "~/api/user";
import PageTitle from "~/components/page-title";

export const ErrorBoundary = () => {
	return (
		<PageTitle>Your code sucks</PageTitle>
	)
};

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url);
	const shop = url.searchParams.get("shop");
	const hmac = url.searchParams.get("hmac");
	const timestamp = url.searchParams.get("timestamp");

	if (shop && hmac && timestamp) {
		await fetch(`${process.env.API_URL}/shopify/auth?shop=${shop}&hmac=${hmac}&timestamp=${timestamp}`);
		return null;
	};

	try {
		const { username } = await checkAuth(request);
		if (username) {
			const stores = await fetchUserStores(request);

			return json({ username, stores });
		} else {
			return redirect("/login");
		}

	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function App() {
	const data = useLoaderData();
	const [, setStores] = useAtom(storesAtom);
	const [, setUser] = useAtom(userAtom);

	useEffect(() => {
		if (data?.stores) {
			setStores(data.stores);
		}

		if (data?.username) {
			setUser(data.username)
		}
	}, [data, setStores, setUser]);

	const [active, setActive] = useState(false);

	const handleScroll = () => {
		if(window.scrollY > 80) {
		  setActive(true);
		} else {
		  setActive(false);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	return (
		<AppProvider i18n={{ ...en, ...ptBR }}>
			<Sidebar active={active}/>
			<div className="p-4 pt-32 md:p-8 lg:p-16 xl:p-20 w-full h-fit overflow-x-hidden">
				<Outlet />
			</div>
		</AppProvider>
	)
}
