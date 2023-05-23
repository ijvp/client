import LineChart from "../line-chart";

export default function ChartsSkeleton() {
	return (
		<div className="flex flex-wrap gap-4">
			<LineChart skeleton />
			<LineChart skeleton />
			<LineChart skeleton />
			<LineChart skeleton />
		</div>
	)
}