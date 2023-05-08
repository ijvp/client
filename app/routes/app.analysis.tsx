import type { V2_MetaFunction } from "@remix-run/node";
import { LineChart } from "~/components/line-chart/index";
import { Suspense } from "react";
export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Analíse" }];
};

export default function Analysis() {
	return (
		<>
			<h2 className="h2">ShopCalê</h2>
			<Suspense fallback={<div>loading</div>}>
				<LineChart />
			</Suspense>
		</>
	)
}