import { Headers } from "~/ts/enums";

const AdInsightsCard = ({ ad, tableHeaders, selectedColumns }) => {
	return (
		<div className="
			nodge
			bg-black-bg
			relative
			border border-black-secondary 
			rounded-md 
			p-4 
			flex flex-col items-center">
			<div
				className="
					absolute
					z-0
					top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
					w-1/2
					aspect-square
					bg-purple
					blur-[115px]
					rounded-full
				"
			/>
			<img src={ad.creativeThumbnail} alt={ad.creativeName} className="w-full aspect-square rounded-md overflow-clip" />
			<p className="subtitle tracking-tight py-4 h-[95px]">{ad["name"]}</p>
			{tableHeaders.map(header => header != 'id' && header !== 'name' && (
				selectedColumns.includes(header) && (
					<div key={header} className="flex items-center justify-between w-full mb-2 last:mb-0">
						<div>{Headers[header]}</div>
						<div className="font-semibold tracking-tight">{typeof ad[header] === 'number' ?
							['impressions', 'outboundClicks', 'pageViews', 'purchases'].includes(header) ?
								ad[header] :
								ad[header].toFixed(2)
							: ad[header]}</div>
					</div>
				)
			))}
		</div>
	)
};

export default AdInsightsCard;