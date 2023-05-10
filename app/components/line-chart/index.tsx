import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { SparkLineChart } from '@shopify/polaris-viz';
import ordersData from "~/data/orders-line-data.json"
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export function ErrorBoundary() {
	return (
		<div>Ocorreu um erro :</div>
	);
};

export default function LineChart() {
	const [render, setRender] = useState(false);

	useEffect(() => {
		if (navigator) {
			setRender(true);
		}
	}, []);

	// throw new Error("Testing Error Boundary");

	if (render) return (
		<div
			className="
			nodge
			max-w-[345px] h-[230px] w-full 
			bg-black-secondary p-4 rounded-lg
			flex flex-col gap-2
		">
			<SparkLineChart data={[{ data: ordersData.lineData }]} />
			<p>{ordersData.title}:</p>
		</div>
	);
}