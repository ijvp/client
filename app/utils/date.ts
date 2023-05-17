export const formatDate = (dateString: string | Date) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2); // add leading zero
	const day = ("0" + date.getDate()).slice(-2); // add leading zero

	return `${year}-${month}-${day}`;
};

//expects yyyy-mm-dd
export const parseDateString = (dateString: string, eod = false) => {
	const [year, month, day] = dateString.split("-").map(Number);
	const date = new Date(year, month - 1, day);

	if (eod) {
		date.setHours(23, 59, 59, 999);
	}

	return date;
}

export const formatDateLabel = (date: Date) => {
	const year = String(date.getFullYear());
	let month = String(date.getMonth() + 1);
	let day = String(date.getDate());
	if (month.length < 2) {
		month = String(month).padStart(2, "0");
	}

	if (day.length < 2) {
		day = String(day).padStart(2, "0");
	}

	return [day, month, year].join("/");
};

//expects yyyy-mm-ddThh
export const standardizeMetricDate = (date) => {
	return new Date(date + ":00:00");
}

//expects yyyy-mm-ddThh for both keys otherwise wont work
export const sortMetricsByDate = (a, b) => {
	const dateA = standardizeMetricDate(a.key);
	const dateB = standardizeMetricDate(b.key);
	return dateA - dateB;
};

