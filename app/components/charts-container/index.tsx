import type { LinksFunction } from "@remix-run/node";
import type { DataPoint } from "@shopify/polaris-viz";
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...lineChartLinks()
];

export default function ChartsContainer({ orders, googleAds, facebookAds }) {
	const calculateNetProfit = (revenueData, adsData) => {
		const netProfitData: DataPoint[] = [];

		// Create a map of ad spend data indexed by date
		const adsMap = adsData.reduce((map, { date, metrics }) => {
			map[date] = metrics.spend;
			return map;
		}, {});

		// Calculate net profit for each date in revenueData
		revenueData.forEach(({ date, value }) => {
			const adSpend = adsMap[date] || 0;
			const netProfit = value - adSpend;
			netProfitData.push({ key: date, value: netProfit });
		});

		// Add missing dates from adsData
		adsData.forEach(({ date, metrics }) => {
			if (!revenueData.some(({ date: revenueDate }) => revenueDate === date)) {
				netProfitData.push({ key: date, value: -metrics.spend });
			}
		});

		return netProfitData;
	};

	const profitData = calculateNetProfit(orders.metricsBreakdown, [...googleAds.metricsBreakdown, ...facebookAds.metricsBreakdown]);
	const netProfit = "R$" + profitData.reduce((accumulator, current) => accumulator + current.value, 0).toFixed(2);

	return (
		<>
			<LineChart title="Faturamento" data={profitData} value={netProfit} />
		</>
	)
}