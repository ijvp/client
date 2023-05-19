import { BarChart } from "@shopify/polaris-viz"

export default function StackedBarChart({ series }) {
	return (
		<BarChart isAnimated data={series} />
	)
}