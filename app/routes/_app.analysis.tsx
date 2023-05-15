import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import IntervalSelect, { links as intervalSelectLinks } from "~/components/interval-select";
import { links as lineChartLinks } from "~/components/line-chart/index";
import api, { fetchShopifyOrders, fetchProfitData } from "~/api";
import { checkAuth } from "~/api/helpers";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { formatStoreName } from "~/utils/store";
import { Granularity } from "~/ts/enums";
import PageTitle from "~/components/page-title";
import ChartsContainer from "~/components/charts-container";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export const links: LinksFunction = () => [
	...intervalSelectLinks(),
	...lineChartLinks()
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
	const params = new URL(request.url).searchParams;
	console.log("analysis loader params", params);

	const profits = fetchProfitData(request);
	return null;
};

export default function Analysis() {
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
			<ChartsContainer />
		</>
	)
}