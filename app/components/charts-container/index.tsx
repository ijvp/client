import type { LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import type { DataPoint } from "@shopify/polaris-viz";
import { startOfToday, endOfToday, differenceInDays } from "date-fns";
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import { parseDateString, sortMetricsByDate, standardizeMetricDate } from "~/utils/date";
import { getCountFromOrderMetrics, getRevenueFromOrderMetrics, getTotalValue } from "~/utils/metrics";
import styles from "./styles.css";


export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...lineChartLinks()
];

function combineArraysSafely(...arrays: any[]) {
	const result = [];

	for (const array of arrays) {
		if (array) {
			for (const item of array) {
				result.push(item);
			}
		}
	}

	return result;
}

export default function ChartsContainer({ orders, googleAds, facebookAds }) {
	const [searchParams] = useSearchParams();
	const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startOfToday();
	const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endOfToday();
	const daysInterval = differenceInDays(end, start);

	const calculateNetProfit = (revenueData, adsData): DataPoint[] => {
		const netProfitData: DataPoint[] = [];

		// Create a map of ad spend data indexed by date
		const adsMap = adsData.reduce((map, { key, value }) => {
			map[key] = value;
			return map;
		}, {});

		// Calculate net profit for each date in revenueData
		revenueData.forEach(({ date, value }) => {
			const adSpend = adsMap[date] || 0;
			const netProfit = value - adSpend;
			netProfitData.push({ key: date, value: netProfit });
		});

		// Add missing dates from adsData
		adsData.forEach(({ key, value }) => {
			if (!revenueData.some(({ date: revenueDate }) => revenueDate === key)) {
				netProfitData.push({ key: key, value: -value });
			}
		});

		return netProfitData;
	};

	const aggregateInvestments = (adsData): DataPoint[] => {
		const investmentsData = {};

		adsData.forEach(ad => {
			if (investmentsData[ad.date]) {
				investmentsData[ad.date] += ad.metrics.spend
			} else {
				investmentsData[ad.date] = ad.metrics.spend
			}
		});

		return Array.from(Object.entries(investmentsData)).map(item => { return { key: item[0], value: item[1] } });
	};

	const fillMissingHours = (dataArray: DataPoint[]): DataPoint[] => {
		const filledArray: DataPoint[] = [];

		if (dataArray.length) {
			const minDate = standardizeMetricDate(dataArray[0].key);
			const maxDate = standardizeMetricDate(dataArray[dataArray.length - 1].key);

			// Iterate over each day between the minimum and maximum dates
			let currentDate = new Date(minDate);
			while (currentDate <= maxDate) {
				// Iterate over each hour of the day
				for (let hour = 0; hour < 24; hour++) {
					// Create the key for the current hour
					currentDate.setUTCHours(hour);
					const month = (currentDate.getUTCMonth() + 1).toString().length > 1 ? currentDate.getUTCMonth() + 1 : (currentDate.getUTCMonth() + 1).toString().padStart(2, "0");
					const hours = currentDate.getUTCHours().toString().length > 1 ? currentDate.getUTCHours() : currentDate.getUTCHours().toString().padStart(2, "0");
					const key = `${currentDate.getUTCFullYear()}-${month}-${currentDate.getUTCDate()}T${hours}`;

					const existingData = dataArray.find((data) => data.key === key);
					if (existingData) {
						filledArray.push(existingData);
					} else {
						filledArray.push({ key, value: 0 });
					}
				}

				// Move to the next day
				currentDate.setDate(currentDate.getDate() + 1);
			}
		}

		return filledArray;
	};

	const calculateTotalROAs = (revenue: number, investment: number) => {
		const ratio = revenue / investment;
		return (isNaN(ratio) || !isFinite(ratio) || ratio < 0) ? 0 : ratio.toFixed(2);
	};

	const revenueData = getRevenueFromOrderMetrics(orders.metricsBreakdown);
	const revenueDataSeries = daysInterval ? revenueData : fillMissingHours(revenueData);
	const totalRevenue = getTotalValue(revenueDataSeries);

	const ordersData = getCountFromOrderMetrics(orders.metricsBreakdown)
	const ordersDataSeries = daysInterval ? ordersData : fillMissingHours(ordersData);
	const totalOrders = getTotalValue(ordersDataSeries, 0);

	const adsInvestments = combineArraysSafely(combineArraysSafely(googleAds?.metricsBreakdown, facebookAds?.metricsBreakdown));
	const investmentsDataSeries = aggregateInvestments(adsInvestments).sort(sortMetricsByDate);
	const totalInvested = getTotalValue(investmentsDataSeries);

	const roas = calculateTotalROAs(parseFloat(totalRevenue), parseFloat(totalInvested));
	const roasDataSeries = investmentsDataSeries.map(investment => {
		let ratio = orders?.metricsBreakdown.find(item => item.date === investment.key)?.value || 0 / investment.value;
		return {
			key: investment.key,
			value: ratio
		}
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 auto items-stretch gap-4 w-fit">
			<LineChart
				title="Faturamento"
				prefix="R$"
				value={totalRevenue}
				data={revenueDataSeries}
			/>
			<LineChart
				title="Quantidade de pedidos"
				value={totalOrders}
				data={ordersDataSeries}
			/>
			<LineChart
				title="Valor investido"
				prefix="R$"
				value={totalInvested}
				data={investmentsDataSeries}
			/>
			<LineChart
				title="ROAs"
				value={roas}
				data={roasDataSeries}
			/>
		</div>
	)
}