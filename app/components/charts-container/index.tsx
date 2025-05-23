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

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const startingToday = new Date(today).setHours(0, 0, 0, 0);
const endingToday = new Date(today).setHours(23, 59, 59, 999);

export default function ChartsContainer({ orders, googleAds, facebookAds }) {
	const [searchParams] = useSearchParams();
	const start = searchParams.get("start") ? parseDateString(searchParams.get("start")) : startingToday;
	const end = searchParams.get("end") ? parseDateString(searchParams.get("end"), true) : endingToday;
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

	const fillMissingDays = (dataArray: DataPoint[]): DataPoint[] => {
		const filledArray: DataPoint[] = [];

		if (dataArray.length) {
			const minDate = start;
			const maxDate = end;
			console.log(minDate, standardizeMetricDate(dataArray[0].key))
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

	interface IOrders {
		data: string,
		count: number,
		value: number
	}

	// const calculateAOV = (orders: IOrders[]) => {
	// 	let totalFaturado = 0;
	// 	let totalPedidos = 0;

	// 	orders.forEach((order) => {
	// 		totalFaturado = totalFaturado + order.value
	// 		totalPedidos++
	// 	})

	// 	return totalFaturado/totalPedidos
	// }

	const revenueData = getRevenueFromOrderMetrics(orders);
	const revenueDataSeries = daysInterval ? revenueData : fillMissingHours(revenueData);
	const totalRevenue = getTotalValue(revenueDataSeries);

	const ordersData = getCountFromOrderMetrics(orders);
	const ordersDataSeries = daysInterval ? ordersData : fillMissingHours(ordersData);
	const totalOrders = getTotalValue(ordersDataSeries, 0);

	const investmentsDataSeries = blendAdsMetrics(googleAds?.metricsBreakdown, facebookAds?.metricsBreakdown);
	const totalInvested = getTotalValue(investmentsDataSeries);

	const roas = calculateTotalROAs(parseFloat(totalRevenue), parseFloat(totalInvested));
	const mer = (parseFloat(totalRevenue) === 0 ? 0 : ((parseFloat(totalInvested) / parseFloat(totalRevenue))*100).toFixed(2).replace(".", ","));
	const aov = (parseFloat(totalOrders) === 0 ? '0,00' : ((parseFloat(totalRevenue)) / totalOrders).toFixed(2).replace(".", ","));
	const cpa = (parseFloat(totalOrders) === 0 ? '0,00' : (parseFloat(totalInvested) / totalOrders).toFixed(2).replace(".", ","));

	const roasDataSeries = orders.length ? investmentsDataSeries.map(investment => {
		let order = orders?.find(item => item.date === investment.key);
		let ratio = (order ? order.value : 0) / investment.value;
		return {
			key: investment.key,
			value: parseFloat(ratio.toFixed(2))
		}
	}) : ordersDataSeries;

	const aovDataSeries = orders.length ? investmentsDataSeries.map(investment => {
		let order = orders?.find(item => item.date === investment.key);
		let aov = (order ? order.value / order.count : 0)
		return {
			key: investment.key,
			value: parseFloat(aov.toFixed(2))
		}
	}) : ordersDataSeries;

	const cpaDataSeries = orders.length ? investmentsDataSeries.map(investment => {
		let order = orders?.find(item => item.date === investment.key);

		let cpa = (order ? investment.value / order.count : 0 )
		cpa = parseFloat(cpa.toFixed(2))
		cpa = (cpa === Infinity ? 0 : cpa)
		return {
			key: investment.key,
			value: cpa
		}
	}) : ordersDataSeries;

	const renderDonutLabel = (innerValueContents: InnerValueContents) => {
		return innerValueContents?.activeValue ? toLocalCurrency(innerValueContents.activeValue) : toLocalCurrency(innerValueContents.totalValue);
	};

	const merDataSeries = orders.length ? investmentsDataSeries.map(investment => {
		let order = orders?.find(item => item.date === investment.key);

		let mer = investment.value / (order ? order.value : 0 )
		mer = (mer === Infinity ? 0 : mer)
		mer = parseFloat((mer*100).toFixed(2))
		return {
			key: investment.key,
			value: mer
		}

	}) : ordersDataSeries;

	const donutData = [facebookAds, googleAds].map(adMetrics => {
		if (adMetrics?.id) {
			return {
				name: adMetrics.id.split('.')[0].split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
				data: [
					{
						key: `${start} - ${end}`,
						value: adMetrics?.metricsBreakdown.reduce((sum: number, ad: any) => sum + ad.metrics.spend, 0)
					}
				]
			}
		}
	}).filter(data => !!data)

	return (
		<div className="flex flex-col md:flex-row flex-wrap gap-4">
			<SimpleChart
				title="Faturamento"
				value={toLocalCurrency(totalRevenue)}
				data={revenueDataSeries}
				yAxisOptions={{ labelFormatter: (y) => `R$${y}` }}
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					},
					valueFormatter: (value) => toLocalCurrency(value)
				}}
			/>
			<SimpleChart
				title="Valor investido"
				value={toLocalCurrency(totalInvested)}
				data={investmentsDataSeries}
				yAxisOptions={{ labelFormatter: (y) => `R$${y}` }}
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					},
					valueFormatter: (value) => toLocalCurrency(value)
				}}
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
						data={donutData}
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
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					}
				}}
			/>
			<SimpleChart
				title="ROAs"
				value={toLocalNumber(roas)}
				data={roasDataSeries}
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					}
				}}
			/>
			<SimpleChart
				title="CPA"
				value={`R$ ${cpa}`}
				data={cpaDataSeries}
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					}
				}}
			/>
			<SimpleChart
				title="AOV"
				value={`R$ ${aov}`}
				data={aovDataSeries}
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					}
				}}
			/>
			<SimpleChart
				title="MER"
				value={`${mer}% `}
				data={merDataSeries}
				tooltipOptions={{
					titleFormatter: (value) => {
						const valueParams = value.split("T");
						const dateStr = valueParams[0];
						const timeStr = valueParams[1];
						const date = new Date(dateStr.replace(/-/g, '/'));
						timeStr && date.setHours(timeStr);
						return `🗓 ${date.toLocaleDateString(undefined, {
							dateStyle: 'long',
						})} ${timeStr ? date.toLocaleTimeString().slice(0, -3) : ""}`;
					}
				}}
			/>
		</div>
	)
}