import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { defer } from "react-router-dom";
import PageTitle from "~/components/page-title";
import IntervalSelect, { links as intervalSelectLinks } from "~/components/interval-select";
import ChartsContainer, { links as chartsContainerLinks } from "~/components/charts-container";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { formatStoreName } from "~/utils/store";
import { fetchShopifyOrders, fetchGoogleAdsInvestment, fetchFacebookAdsInvestment } from "~/api";
import { checkAuth } from "~/api/helpers";


export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export const links: LinksFunction = () => [
	...intervalSelectLinks(),
	...chartsContainerLinks()
];

export function ErrorBoundary() {
	return (
		<div>Analysis page error boundary</div>
	)
};

export const loader = async ({ request }: LoaderArgs) => {
	const user = await checkAuth(request);
	if (!user) {
		return redirect("/login");
	};

	const store = user.shops.find(shop => shop.name === new URL(request.url).searchParams.get("store")) || user.shops[0];
	const ordersPromise = fetchShopifyOrders(request, user);
	const googleAdsPromise = store.google_client && fetchGoogleAdsInvestment(request, user);
	const facebookAdsPromise = store.facebook_business && fetchFacebookAdsInvestment(request, user);
	return defer({ data: Promise.all([ordersPromise, googleAdsPromise, facebookAdsPromise]) });
};

export default function Analysis() {
	const loaderData = useLoaderData();

	const [stores] = useAtom(storesAtom);
	const [selectedIndex] = useAtom(storeIndexAtom);

	if (!stores?.length) {
		return (
			<>Adicione uma loja</>
		)
	};

	return (
		<>
			<PageTitle>
				{formatStoreName(stores[selectedIndex].name)}
			</PageTitle>
			<IntervalSelect />
			<Suspense fallback={<div>Carregando...</div>}>
				<Await resolve={loaderData.data}>
					{([orders, googleAds, facebookAds]) => (
						<ChartsContainer orders={orders} facebookAds={facebookAds} googleAds={googleAds} />
					)}
				</Await>
			</Suspense >
		</>
	);
};