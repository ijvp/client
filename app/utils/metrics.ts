import { sortMetricsByDate } from "./date"

export const sortMetricsData = (metrics: any[]) => {
	return metrics.sort(sortMetricsByDate);
};

export const getRevenueFromOrderMetrics = (orderMetrics: any[]) => {
	return sortMetricsData(orderMetrics.map(order => { return { key: order.date, value: order.value } }));
};

export const getCountFromOrderMetrics = (orderMetrics: any[]) => {
	return sortMetricsData(orderMetrics.map(order => { return { key: order.date, value: order.count } }));
};

export const getTotalValue = (data: any[], precision = 2) => {
	return data.reduce((sum, item) => sum + item.value, 0).toFixed(precision);
};

