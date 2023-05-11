import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Suspense } from "react";
import IntervalSelect from "~/components/interval-select";
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import api from "~/api";
import { checkAuth } from "~/api/helpers";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { formatStoreName } from "~/utils/store";

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
	}

	return null;
};

export default function Analysis() {
	const [stores, setStores] = useAtom(storesAtom);
	const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);

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