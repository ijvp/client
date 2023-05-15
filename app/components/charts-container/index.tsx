import type { LinksFunction } from "@remix-run/node"
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...lineChartLinks()
];

export default function ChartsContainer({ orders, googleAds, facebookAds }) {
	return (
		<>
			This is the charts container
			<LineChart />
		</>
	)
}