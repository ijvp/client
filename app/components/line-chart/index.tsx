import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { SparkLineChart } from '@shopify/polaris-viz';
import orders from "~/data/orders-response.json";
import googleAds from "~/data/google-ads-reponse.json";

import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function LineChart() {
	const [render, setRender] = useState(false);

	const calculateNetProfit = (revenueData, adsData) => {
		const netProfitData = [];

		const adsMap = adsData.reduce((map, ad) => {
			const { date, metrics } = ad;
			map[date] = metrics.spend;
			return map;
		}, {});

		revenueData.forEach(({ date, value }) => {
			const adSpend = adsMap[date] || 0;
			const netProfit = value - adSpend;
			netProfitData.push({ key: date, value: netProfit })
		});

		return netProfitData;
	};

	const profitData = calculateNetProfit(orders.metricsBreakdown, googleAds.metricsBreakdown);

	useEffect(() => {
		if (navigator) {
			setRender(true);
		}
	}, []);

	return (
		<div
			className="
			nodge
			max-w-[345px] h-[230px] w-full 
			bg-black-secondary p-4 pb-16 rounded-lg
			flex flex-col gap-2
		">
			{render && <SparkLineChart data={[{ data: profitData }]} />}
			<div className="h-16 absolute bottom-0 flex items-center justify-start">
				<p>Faturamento:</p>
			</div>
		</div>
	);
}