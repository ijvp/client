import { BarChart } from "@shopify/polaris-viz"
import { useEffect, useState } from "react";

export default function StackedBarChart({ data, title, value, prefix, skeleton, xAxisOptions, yAxisOptions }) {
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
		w-[322px] h-[165px]
		p-4 pb-24 rounded-lg
		bg-black-bg
		border border-black-secondary box-content
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
						{render &&
							<BarChart isAnimated data={data} />
						}
						<div className="h-16 absolute bottom-2">
							<p className="text-white font-semibold">
								{title}:
								<br />
								<span className="h h5">{prefix}{value}</span>
							</p>
						</div >
					</>)}
		</div>

	)
}