import LineChart from "../line-chart";

export default function ChartsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 auto items-stretch gap-4 w-fit">
			<LineChart skeleton />
			<LineChart skeleton />
			<LineChart skeleton />
			<LineChart skeleton />
		</div>
	)
}