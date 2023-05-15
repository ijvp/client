import type { LinksFunction } from "@remix-run/node"
import LineChart, { links as lineChartLinks } from "~/components/line-chart/index";
import { fetchProfitData } from "~/api";
import styles from "./styles.css";
import { useQuery } from "@tanstack/react-query";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function ChartsContainer() {

	return (
		<>
			This is the charts container
			<LineChart />
		</>
	)
}