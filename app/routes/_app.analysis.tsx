import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { defer } from "react-router-dom";
import PageTitle from "~/components/page-title";
import IntervalSelect, { links as intervalSelectLinks } from "~/components/interval-select";
import ChartsContainer from "~/components/charts-container";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { formatStoreName } from "~/utils/store";
import { fetchShopifyOrders, fetchGoogleAdsInvestment, fetchFacebookAdsInvestment } from "~/api";
import { checkAuth } from "~/api/helpers";


export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export const links: LinksFunction = () => [
	...intervalSelectLinks()
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

	const ordersPromise = fetchShopifyOrders(request, user);
	const googleAdsPromise = fetchGoogleAdsInvestment(request, user);
	const facebookAdsPromise = fetchFacebookAdsInvestment(request, user);
	return defer({ orders: ordersPromise });
};

export default function Analysis() {
	const loaderData = useLoaderData();
	const navigation = useNavigation();
	console.log(loaderData);

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
			<Suspense fallback={<div>loading charts data...</div>}>
				<Await resolve={loaderData}>
					{({ orders, facebookAds, googleAds }) => (
						<>
							<ChartsContainer orders={orders} facebookAds={facebookAds} googleAds={googleAds} />
							<p id="test-id">{orders?.data}</p>
						</>
					)}
				</Await>
			</Suspense >
		</>
	);
};