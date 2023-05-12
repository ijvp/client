import type { ActionArgs, LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Suspense } from "react";
import IntervalSelect from "~/components/interval-select";
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import api, { fetchShopifyOrders } from "~/api";
import { checkAuth } from "~/api/helpers";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { formatStoreName } from "~/utils/store";
import { Granularity } from "~/ts/enums";
import PageTitle from "~/components/page-title";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export const links: LinksFunction = () => [
	...lineChartLinks()
];

export function ErrorBoundary() {
	return (
		<div>Analysis page error boundary</div>
	)
};

export const loader = async ({ request }: LoaderArgs) => {
	const authenticated = await checkAuth(request);
	if (!authenticated) {
		return redirect("/login");
	};

	// const orders = await api.post()
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
			<LineChart />
		</>
	)
}