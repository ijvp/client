import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { Suspense } from "react";
import IntervalSelect from "~/components/interval-select";
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export const links: LinksFunction = () => [
	...lineChartLinks()
];

export default function Analysis() {
	return (
		<>
			<h2 className="h2 border-b border-solid border-black-secondary">ShopCalê</h2>
			<IntervalSelect />
			<Suspense fallback={<div>loading</div>}>
				<LineChart />
			</Suspense>
		</>
	)
}