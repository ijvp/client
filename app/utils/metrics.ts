import { sortMetricsByDate } from "./date"

export const sortMetricsData = (metrics: any[]) => {
	return metrics.sort(sortMetricsByDate);
};

export const getRevenueFromOrderMetrics = (orderMetrics: any[]) => {
	if (orderMetrics.length) {
		return sortMetricsData(orderMetrics.map(order => { return { key: order.date, value: order.value } }));
	} else {
		return []
	}

};

export const getCountFromOrderMetrics = (orderMetrics: any[]) => {
	if (orderMetrics.length) {
		return sortMetricsData(orderMetrics.map(order => { return { key: order.date, value: order.count } }));
	} else {
		return []
	}
};

export const getTotalValue = (data: any[], precision = 2) => {
	return data.reduce((sum, item) => sum + item.value, 0).toFixed(precision);
};

export const blendAdsMetrics = (...arrays) => {
	const adsMap = {};

	if (arrays) {
		arrays.forEach((array) => {
			if (array) {
				array.forEach((item) => {
					const date = item.date;
					const spend = item.metrics?.spend || 0;

					if (date in adsMap) {
						adsMap[date] += parseFloat(spend.toFixed(2));
					} else {
						adsMap[date] = parseFloat(spend.toFixed(2));
					}
				});
			}
		});
	}

	const blended = Object.entries(adsMap).map(([key, value]) => ({ key, value }));
	return sortMetricsData(blended);
};