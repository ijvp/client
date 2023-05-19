import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import type { DataPoint } from '@shopify/polaris-viz';
import { SparkLineChart } from '@shopify/polaris-viz';
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

interface LineChartProps {
	data?: DataPoint[],
	title?: string,
	value?: number | string,
	prefix?: string,
	skeleton?: boolean
};

export default function LineChart({ data, title, value, prefix, skeleton }: LineChartProps) {
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
			w-[356px] h-[238px]
			p-4 pb-24 rounded-lg
			bg-black-bg
			border border-black-secondary box-border
			flex flex-col gap-2
			overflow-clip
		">
			<div
				className="
					absolute
					z-0
					top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
					w-[110px]
					aspect-square
					bg-purple
					blur-[115px]
					rounded-full
				"
			/>
			{skeleton ?
				(<div className="skeleton-effect">
				</div>)
				: (
					<>
						{render && <SparkLineChart data={[{ data: data }]} />}
						<div className="h-16 absolute bottom-4">
							<p className="text-white font-semibold">
								{title}:
								<br />
								<span className="h h5">{prefix}{value}</span>
							</p>
						</div >
					</>)}
		</div >
	);
}