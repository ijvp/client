import type { LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import type { DataPoint } from "@shopify/polaris-viz";
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import { parseDateString, sortMetricsByDate, standardizeMetricDate } from "~/utils/date";
import { startOfToday, endOfToday, differenceInDays } from "date-fns";
import styles from "./styles.css";
import { sortMetricsByDate, standardizeMetricDate } from "~/utils/date";
import { getCountFromOrderMetrics, getRevenueFromOrderMetrics, getTotalValue } from "~/utils/metrics";

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

	//TODO: consertar para quando ha apenas um item no array
	const fillMissingHours = (dataArray): DataPoint[] => {
		if (dataArray.length) {
			const filledArray = [];

			// Get the minimum and maximum dates from the array
			const minDate = standardizeMetricDate(dataArray[0].key);
			const maxDate = standardizeMetricDate(dataArray[dataArray.length - 1].key);

			// Adjust the minimum and maximum dates based on the local timezone offset
			const minDateOffset = minDate.getTimezoneOffset();
			const maxDateOffset = maxDate.getTimezoneOffset();
			minDate.setMinutes(minDate.getMinutes() - minDateOffset);
			maxDate.setMinutes(maxDate.getMinutes() - maxDateOffset);

			// Iterate over each hour between the minimum and maximum dates
			let currentDate = new Date(minDate);
			while (currentDate <= maxDate) {
				const key = currentDate.toISOString().slice(0, 13);

				// Check if the current hour exists in the original array
				const existingData = dataArray.find((data) => data.key === key);
				if (existingData) {
					filledArray.push(existingData);
				} else {
					filledArray.push({ key, value: 0 });
				}

				// Move to the next hour
				currentDate.setHours(currentDate.getHours() + 1);
			}

			return filledArray;
		} else {
			return [];
		}
	};

	const calculateTotalROAs = (revenue: number, investment: number) => {
		const ratio = revenue / investment;
		return (isNaN(ratio) || !isFinite(ratio) || ratio < 0) ? 0 : ratio.toFixed(2);
	};

	const adsInvestments = combineArraysSafely(combineArraysSafely(googleAds?.metricsBreakdown, facebookAds?.metricsBreakdown));
	const investmentsData = aggregateInvestments(adsInvestments).sort(sortMetricsByDate);
	const totalInvested = getTotalValue(investmentsData);

	const revenueData = getRevenueFromOrderMetrics(orders.metricsBreakdown);
	const totalRevenue = getTotalValue(revenueData);

	const ordersData = getCountFromOrderMetrics(orders.metricsBreakdown);
	const totalOrders = getTotalValue(ordersData, 0);

	const roas = calculateTotalROAs(parseFloat(totalRevenue), parseFloat(totalInvested));
	const roasData = investmentsData.map(investment => {
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
				data={revenueData}
			/>
			<LineChart
				title="Quantidade de pedidos"
				value={totalOrders}
				data={ordersData}
			/>
			<LineChart
				title="Valor investido"
				prefix="R$"
				value={totalInvested}
				data={investmentsData}
			/>
			<LineChart
				title="ROAs"
				value={roas}
				data={roasData}
			/>
		</div>
	)
}