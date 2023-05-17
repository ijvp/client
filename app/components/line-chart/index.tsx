import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { SparkLineChart } from '@shopify/polaris-viz';
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function LineChart({ data, title, value }) {
	const [render, setRender] = useState(false);

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
			bg-black-secondary p-4 pb-24 rounded-lg
			flex flex-col gap-2
		">
			{render && <SparkLineChart data={[{ data: data }]} />}
			<div className="h-16 absolute bottom-4">
				<p className="text-white font-semibold">
					{title}:
					<br />
					<span className="h h5">{value}</span>
				</p>
			</div >
		</div >
	);
}