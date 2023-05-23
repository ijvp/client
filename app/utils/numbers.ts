export const toLocalCurrency = (value: number | string) => {
	return new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(parseFloat(value.toString()));
}

export const toLocalNumber = (value: number | string) => {
	return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(parseFloat(value.toString()));
}