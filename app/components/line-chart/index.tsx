import { useCallback, useEffect, useState } from "react";
import { BarChart, SparkLineChart } from '@shopify/polaris-viz';
import { Modal, SkeletonDisplayText } from '@shopify/polaris';
import ordersData from "~/data/orders-line-data.json"

export function LineChart() {
	const [render, setRender] = useState(false);
	console.log([{ data: ordersData.lineData }]);

	useEffect(() => {
		if (navigator) {
			setRender(true);
		}
	}, []);

	if (render) return (
		<div
			className="
			max-w-[345px] h-[230px] w-full 
			bg-black-secondary p-4 rounded-lg
			flex flex-col gap-2
		">
			<SparkLineChart data={[{ data: ordersData.lineData }]} />
			<p>{ordersData.title}:</p>
		</div>
	);
}