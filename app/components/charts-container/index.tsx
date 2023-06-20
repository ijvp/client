import type { LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import type { DataPoint, InnerValueContents } from "@shopify/polaris-viz";
import { DonutChart } from "@shopify/polaris-viz";
import { startOfToday, endOfToday, differenceInDays } from "date-fns";
import SimpleChart, { links as SimpleChartLinks } from "~/components/line-chart/index";
import { parseDateString, standardizeMetricDate } from "~/utils/date";
import { blendAdsMetrics, getCountFromOrderMetrics, getRevenueFromOrderMetrics, getTotalValue } from "~/utils/metrics";
import styles from "./styles.css";
import { toLocalCurrency, toLocalNumber } from "~/utils/numbers";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...SimpleChartLinks()
];

export default function ChartsContainer({ orders, googleAds, facebookAds }) {
	const [searchParams] = useSearchParams();
	const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startOfToday();
	const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endOfToday();
	const daysInterval = differenceInDays(end, start);

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
					const day = currentDate.getUTCDate().toString().length > 1 ? currentDate.getUTCDate() : currentDate.getUTCDate().toString().padStart(2, "0");
					const key = `${currentDate.getUTCFullYear()}-${month}-${day}T${hours}`;
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

	const revenueData = getRevenueFromOrderMetrics(orders);
	const revenueDataSeries = daysInterval ? revenueData : fillMissingHours(revenueData);
	const totalRevenue = getTotalValue(revenueDataSeries);

	const ordersData = getCountFromOrderMetrics(orders);
	const ordersDataSeries = daysInterval ? ordersData : fillMissingHours(ordersData);
	const totalOrders = getTotalValue(ordersDataSeries, 0);

	const investmentsDataSeries = blendAdsMetrics(googleAds?.metricsBreakdown, facebookAds?.metricsBreakdown);
	const totalInvested = getTotalValue(investmentsDataSeries);

	const roas = calculateTotalROAs(parseFloat(totalRevenue), parseFloat(totalInvested));
	const roasDataSeries = investmentsDataSeries.map(investment => {
		let order = orders?.find(item => item.date === investment.key);
		let ratio = (order ? order.value : 0) / investment.value;
		return {
			key: investment.key,
			value: parseFloat(ratio.toFixed(2))
		}
	});

	const renderDonutLabel = (innerValueContents: InnerValueContents) => {
		return innerValueContents?.activeValue ? toLocalCurrency(innerValueContents.activeValue) : toLocalCurrency(innerValueContents.totalValue);
	};

	return (
		<div className="flex flex-wrap gap-4">
			<SimpleChart
				title="Faturamento"
				value={toLocalCurrency(totalRevenue)}
				data={revenueDataSeries}
				yAxisOptions={{ labelFormatter: (y) => `R$${y}` }}
			/>
			<SimpleChart
				title="Valor investido"
				value={toLocalCurrency(totalInvested)}
				data={investmentsDataSeries}
				yAxisOptions={{ labelFormatter: (y) => `R$${y}` }}
			>
				<div
					className="
					relative 
					w-full max-w-3xl 
					aspect-square
					p-4
					flex flex-col items-center justify-center
					bg-black-bg 
					border border-black-secondary rounded-xl
				">
					<h2 className="h5">{new Intl.DateTimeFormat('pt-BR').format(start)} - {new Intl.DateTimeFormat('pt-BR').format(end)}</h2>
					<DonutChart
						data={[
							facebookAds?.metricsBreakdown && {
								name: "Facebook Ads",
								data: [
									{
										key: `${start} - ${end}`,
										value: facebookAds?.metricsBreakdown.reduce((sum, ad) => sum + ad.metrics.spend, 0)
									}
								]
							},
							googleAds?.metricsBreakdown && {
								name: "Google Ads",
								data: [
									{
										key: `${start} - ${end}`,
										value: googleAds?.metricsBreakdown.reduce((sum, ad) => sum + ad.metrics.spend, 0)
									}
								]
							}
						]}
						labelFormatter={(y) => toLocalCurrency(y)}
						renderInnerValueContent={renderDonutLabel}
					/>
				</div>
			</SimpleChart>
			<SimpleChart
				title="Pedidos"
				value={totalOrders}
				data={ordersDataSeries}
				yAxisOptions={{ integersOnly: true }}
			/>
			<SimpleChart
				title="ROAs"
				value={toLocalNumber(roas)}
				data={roasDataSeries}
			/>
		</div>
	)
}