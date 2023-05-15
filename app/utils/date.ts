export const formatDate = (dateString: string | Date) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2); // add leading zero
	const day = ("0" + date.getDate()).slice(-2); // add leading zero

	return `${year}-${month}-${day}`;
};

export const parseDateString = (dateString: string) => {
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
};
