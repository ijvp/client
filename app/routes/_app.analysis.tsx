import { LinksFunction, LoaderArgs, V2_MetaFunction, json } from "@remix-run/node";
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
			store = stores[0]
		};

		const orders = await fetchShopifyOrders(request, user, store);
		// const googleAds = await fetchGoogleAdsInvestment(request, user, store);
		return defer({ orders });
	} catch (error) {
		console.log(error);
		return null;
	}

	// if (store) {
	// 	const ordersPromise = fetchShopifyOrders(request, user);
	// 	const googleAdsPromise = store?.google_client && fetchGoogleAdsInvestment(request, user);
	// 	const facebookAdsPromise = store?.facebook_business && fetchFacebookAdsInvestment(request, user);
	// 	return defer({ data: Promise.all([ordersPromise, googleAdsPromise, facebookAdsPromise]) });
	// }
};

export default function Analysis() {
	const loaderData = useLoaderData();
	const navigation = useNavigation();

	const [stores] = useAtom(storesAtom);
	const [selectedIndex] = useAtom(storeIndexAtom);

	console.log(loaderData)
	if (!stores?.length) {
		return (
			<PageTitle>Você não tem uma loja cadastrada ainda...</PageTitle>
		)
	};

	return (
		<>
			<PageTitle>
				{formatStoreName(stores[selectedIndex])}
			</PageTitle>
			<IntervalSelect />
			<Suspense fallback={<ChartsSkeleton />}>
				<Await resolve={loaderData?.orders} errorElement={<h2 className="h4 my-12">Parece que algo deu errado, tente buscar dados de outro periodo ou recarregue a página</h2>}>
					{(data) =>
						navigation.state === "idle" ? (
							<ChartsContainer
								orders={data}
								facebookAds={data?.facebookAds}
								googleAds={data?.googleAds}
							/>
						) : navigation.state === "loading" ? (
							<ChartsSkeleton />
						) : null}
				</Await>
			</Suspense>
		</>
	);
};