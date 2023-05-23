import type { LinksFunction } from "@remix-run/node";
import { ReactNode, useEffect, useState } from "react";
import type { DataPoint } from '@shopify/polaris-viz';
import { LineChart } from '@shopify/polaris-viz';
import styles from "./styles.css";
import Overlay from "../overlay";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

interface LineChartProps {
	data?: DataPoint[],
	title?: string,
	value?: number | string,
	prefix?: string,
	skeleton?: boolean,
	children?: ReactNode
};

export default function SimpleChart({ data, title, value, prefix, skeleton, xAxisOptions, yAxisOptions, children }: LineChartProps) {
	const [render, setRender] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (navigator) {
			setRender(true);
		}
	}, []);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className={`
				nodge
				min-w-[354px] h-[165px] flex-grow
				py-4 pb-24 rounded-lg
				bg-black-bg
				border border-black-secondary box-content
				flex flex-col gap-2
				overflow-clip
				${children ? "cursor-pointer" : ""}
			`}>
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
							{render &&
								<LineChart
									data={[{ name: title, data: data }]}
									xAxisOptions={{ ...xAxisOptions, hide: true }}
									yAxisOptions={yAxisOptions}
									showLegend={false}
								/>
							}
							<div className="h-16 absolute bottom-2 left-4">
								<p className="text-white font-semibold">
									{title}:
									<br />
									<span className="h h5">{prefix}{value}</span>
								</p>
							</div >
						</>)}
			</div>
			{children && open && (
				<Overlay onClick={() => setOpen(false)}>
					{children}
				</Overlay>
			)}
		</>
	);
}