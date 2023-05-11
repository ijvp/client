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
	const cookie = request.headers.get("Cookie");

	return checkAuth(request)
		.then(authenticated => {
			console.log("auth", authenticated)
			if (!authenticated) {
				return redirect("/login");
			} else {
				return null;
			}
		})
		.catch(error => {
			console.log(error);
		});
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
			<h2 className="
			h2 
			border-b border-solid border-black-secondary
			">
				{formatStoreName(stores[selectedIndex].name)}
			</h2>
			<IntervalSelect />
			<Suspense fallback={<div>loading</div>}>
				<LineChart />
			</Suspense>
		</>
	)
}