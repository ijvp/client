import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { defer } from "react-router-dom";
import PageTitle from "~/components/page-title";
import IntervalSelect, { links as intervalSelectLinks } from "~/components/interval-select";
import ChartsContainer, { links as chartsContainerLinks } from "~/components/charts-container";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { formatStoreName } from "~/utils/store";
import { checkAuth } from "~/api/helpers";
import ChartsSkeleton from "~/components/charts-skeleton";
import { fetchFacebookAdsInvestment } from "~/api/facebook";
import { fetchGoogleAdsInvestment } from "~/api/google";
import { fetchShopifyOrders } from "~/api/shopify";
import { fetchUserStores } from "~/api/user";
import { fetchActiveConnections } from "~/api";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export const links: LinksFunction = () => [
	...intervalSelectLinks(),
	...chartsContainerLinks()
];

export function ErrorBoundary() {
	return (
		<PageTitle>Erro ao carregar análise</PageTitle>
	)
};

export const loader = async ({ request }: LoaderArgs) => {
	try {
		const user = await checkAuth(request);
		if (!user) {
			return redirect("/login");
		};

		const searchParams = new URL(request.url).searchParams;
		let store = searchParams.get("store");

		if (!store) {
			const stores = await fetchUserStores(request);
			if (stores) {
				store = stores[0]
			}
		};

		const connections = await fetchActiveConnections({ request });
		const orders = fetchShopifyOrders(request, user, store);
		const googleAds = store && connections?.google_ads && fetchGoogleAdsInvestment(request, user, store);
		const facebookAds = connections?.facebook_ads && fetchFacebookAdsInvestment(request, user, store);
		const promises = [orders, googleAds, facebookAds];
		return defer({ data: Promise.all(promises) });
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Analysis() {
	const loaderData = useLoaderData();
	const navigation = useNavigation();

	const [stores] = useAtom(storesAtom);
	const [selectedIndex] = useAtom(storeIndexAtom);

	if (!stores?.length) {
		return (
			<>
				<PageTitle>Análise</PageTitle>
				<p className="subtitle">Você não tem uma loja cadastrada ainda, conecte uma loja shopify para começar!</p>
			</>

		)
	};

	return (
		<>
			<PageTitle>
				{formatStoreName(stores[selectedIndex])}
			</PageTitle>
			<IntervalSelect />
			<Suspense fallback={<ChartsSkeleton />}>
				<Await resolve={loaderData?.data} errorElement={<h2 className="h4 my-12">Parece que algo deu errado, tente buscar dados de outro periodo ou recarregue a página</h2>}>
					{([orders, googleAds, facebookAds]) =>
						navigation.state === "idle" ? (
							<ChartsContainer
								orders={!orders.error ? orders : []}
								googleAds={googleAds}
								facebookAds={facebookAds}
							/>
						) : navigation.state === "loading" ? (
							<ChartsSkeleton />
						) : null}
				</Await>
			</Suspense>
		</>
	);
};