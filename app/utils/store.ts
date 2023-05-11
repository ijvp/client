const capitalize = (word: string) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export const formatStoreName = (name: string) => {
	const removedUrl = name.substring(0, name.indexOf(".myshopify.com"));
	return [...removedUrl.split("-").map(word => capitalize(word))].join(" ");
};