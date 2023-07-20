import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Combobox, HorizontalStack, Icon, LegacyStack, Listbox, Stack, Tag, TextContainer, TextField, VerticalStack } from "@shopify/polaris";
import { SearchMinor } from '@shopify/polaris-icons';
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchFacebookAdsInsights } from "~/api/facebook";
import { checkAuth } from "~/api/helpers";
import { fetchUserStores } from "~/api/user";
import Input from "~/components/input";
import IntervalSelect from "~/components/interval-select";
import PageTitle from "~/components/page-title";

export const loader = async ({ request }: LoaderArgs) => {
	const user = await checkAuth(request);
	if (!user) {
		return redirect("/login");
	};

	const searchParams = new URL(request.url).searchParams;
	let store = searchParams.get("store");

	if (!store) {
		const stores = await fetchUserStores(request);

		if (stores.length) {
			store = stores[0]
			const adInsights = await fetchFacebookAdsInsights(request, user, store);
			return json(adInsights);
		}
	};
}

export function ErrorBoundary() {
	return (
		<>
			<PageTitle>Erro ao carregar criativos</PageTitle>
			<p className="subtitle">Algo deu errado, verifique se ja adicionou alguma loja ou então tente novamente mais tarde</p>
		</>
	);
};

const Headers = {
	name: "Nome",
	spend: "Valor investido",
	impressions: "Impressões",
	outboundClicks: "Cliques de saída",
	pageViews: "Visualizações de página",
	purchases: "Compras",
	purchasesConversionValue: "Valor de conversão",
	CTR: "CTR",
	CPS: "CPS",
	CPA: "CPA",
	ROAS: "ROAS"
};

export default function CreativesPage() {
	const ads = useLoaderData();
	const tableHeaders = Object.keys(Headers);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredAds, setFilteredAds] = useState(ads);

	const totalSpend = filteredAds.reduce((acc, item) => acc + item.spend, 0);
	const totalImpressions = filteredAds.reduce((acc, item) => acc + item.impressions, 0);
	const totalClicks = filteredAds.reduce((acc, item) => acc + item.outboundClicks, 0);
	const totalPageViews = filteredAds.reduce((acc, item) => acc + item.pageViews, 0);
	const totalPurchasesConversions = filteredAds.reduce((acc, item) => acc + item.purchasesConversionValue, 0).toFixed(2);
	const totalPurchases = filteredAds.reduce((acc, item) => acc + item.purchases, 0);

	const columnOptions = useMemo(
		() => Array.from(Object.entries(Headers).map(entry => {
			return {
				value: entry[0],
				label: entry[1]
			}
		})),
		[]
	);


	const [selectedColumns, setSelectedColumns] = useState(Array.from(Object.keys(Headers)));
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState(columnOptions);
	const updateText = useCallback(
		(value: string) => {
			setInputValue(value)
			if (value === "") {
				setOptions(columnOptions);
				return;
			}

			const filterRegex = new RegExp(value, 'i');
			const resultOptions = columnOptions.filter(option => option.label.match(filterRegex));
			setOptions(resultOptions);
		},
		[columnOptions]
	);

	const updateSelection = useCallback(
		(selected: string) => {
			if (selectedColumns.includes(selected)) {
				setSelectedColumns(selectedColumns.filter(column => column !== selected));
			} else {
				setSelectedColumns([...selectedColumns, selected]);
			}

			updateText("");
		},
		[selectedColumns, updateText]
	);

	const removeTag = useCallback(
		(tag: string) => () => {
			const columns = [...selectedColumns];
			columns.splice(columns.indexOf(tag), 1);
			setSelectedColumns(columns);
		},
		[selectedColumns]
	);

	const tagsMarkup = selectedColumns.map((column, index) => {
		return (<Tag key={index} onRemove={removeTag(column)}>
			{Headers[column]}
		</Tag>)
	});

	const columnsMarkup =
		options.length > 0
			? options.map((option, index) => {
				const { label, value } = option;
				return (
					<Listbox.Option
						key={index}
						value={value}
						selected={selectedColumns.includes(value)}
						accessibilityLabel={label}
					>
						{label}
					</Listbox.Option>
				)
			}) : null;

	useEffect(() => {
		const filteredData = ads.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
		setFilteredAds(filteredData);
	}, [ads, searchTerm]);

	return (
		<>
			<PageTitle>Criativos</PageTitle>
			<p className="subtitle">
				Aqui você tem uma visualização geral de todos os seus criativos pertencentes a campanhas do Facebook Ads. Você pode buscar e agrupar por nome para ter uma visão melhor da performance de criativos duplicados!
			</p>
			<IntervalSelect />
			<Input
				name="ad-name"
				type="text"
				placeholder="agrupar por nome de anuncio"
				className="w-full my-8"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<div className="flex flex-col gap-4 mb-8">
				<Combobox
					allowMultiple
					activator={
						<Combobox.TextField
							prefix={<Icon source={SearchMinor} />}
							onChange={updateText}
							label="Selecionar colunas"
							labelHidden
							value={inputValue}
							placeholder="Selecionar colunas"
							autoComplete="off"
						/>
					}>
					{columnsMarkup ? (
						<Listbox onSelect={updateSelection}>{columnsMarkup}</Listbox>
					) : null}
				</Combobox>
				<HorizontalStack gap="4">
					<LegacyStack>{tagsMarkup}</LegacyStack>
				</HorizontalStack>
			</div>
			<table className="w-full mb-12">
				<thead>
					<tr>
						{tableHeaders.map((header: string) =>
							selectedColumns.includes(header) && (<th key={header}>{Headers[header]}</th>))}
					</tr>
				</thead>
				<tbody>
					{filteredAds.map((ad: any) => (
						<tr key={ad.id}>
							{tableHeaders.map(header => header != 'id' && (
								selectedColumns.includes(header) && (
									<td key={header} className="p-2 border border-purple" >
										{typeof ad[header] === 'number' ?
											['impressions', 'outboundClicks', 'pageViews', 'purchases'].includes(header) ?
												ad[header] :
												ad[header].toFixed(2)
											: ad[header]}
									</td>
								)
							))}
						</tr>
					))}
					<tr>
						{selectedColumns.slice(0, 1).map(header => (
							<td key={header} colSpan={1} className="p-2 border border-purple"><b>Total</b></td>
						))}
						{selectedColumns.slice(1).map(header => (
							<td key={header} className="p-2 border border-purple">
								<b>
									{header === 'spend' ? totalSpend.toFixed(2) :
										header === 'impressions' ? totalImpressions :
											header === 'outboundClicks' ? totalClicks :
												header === 'pageViews' ? totalPageViews :
													header === 'purchases' ? totalPurchases :
														header === 'purchasesConversionValue' ? totalPurchasesConversions :
															header === 'CTR' ? (totalClicks / totalImpressions * 100).toFixed(2) :
																header === 'CPS' ? (totalPageViews != 0 ? (totalSpend / totalPageViews) : 0).toFixed(2) :
																	header === 'CPA' ? (totalPurchases != 0 ? (totalSpend / totalPurchases) : 0).toFixed(2) :
																		header === 'ROAS' ? (totalPurchasesConversions / totalSpend).toFixed(2) : ''
									}
								</b>
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</>
	);
};
