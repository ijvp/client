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
	console.log("loader called.....");

	try {
		const user = await checkAuth(request);
		if (!user) {
			return redirect("/login");
		};

		const store = user.shops?.find(shop => shop.name === new URL(request.url).searchParams.get("store")) || user.shops[0];
		if (store) {
			const ordersPromise = fetchShopifyOrders(request, user, store);
			const googleAdsPromise = store.google_client && fetchGoogleAdsInvestment(request, user, store);
			const facebookAdsPromise = store.facebook_business && fetchFacebookAdsInvestment(request, user, store);
			console.log("promises list...", ordersPromise, googleAdsPromise, facebookAdsPromise);
			return defer({ data: Promise.all([ordersPromise, googleAdsPromise, facebookAdsPromise]) });
		}
	} catch (error) {
		console.error(error);
		return json({ success: false, message: "Algo deu errado, verifique sua senha" });
	}

};

export default function Analysis() {
	const loaderData = useLoaderData();
	const navigation = useNavigation();

	const [stores] = useAtom(storesAtom);
	const [selectedIndex] = useAtom(storeIndexAtom);

	if (!stores?.length) {
		return (
			<PageTitle>Você não tem uma loja cadastrada ainda...</PageTitle>
		)
	};

	return (
		<>
			<PageTitle>
				{formatStoreName(stores[selectedIndex].name)}
			</PageTitle>
			<IntervalSelect />
			<Suspense fallback={<ChartsSkeleton />}>
				<Await resolve={loaderData?.data} errorElement={<h2 className="h4 my-12">Parece que algo deu errado, tente buscar dados de outro periodo ou recarregue a página</h2>}>
					{([orders, googleAds, facebookAds]) =>
						navigation.state === "idle" ? (
							<ChartsContainer
								orders={orders}
								facebookAds={facebookAds}
								googleAds={googleAds}
							/>
						) : navigation.state === "loading" ? (
							<ChartsSkeleton />
						) : null}
				</Await>
			</Suspense>
		</>
	);
};