import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { fetchFacebookAdsInsights } from "~/api/facebook";
import { checkAuth } from "~/api/helpers";
import { fetchUserStores } from "~/api/user";
import Input from "~/components/input";
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

export default function CreativesPage() {
	const ads = useLoaderData();
	const tableHeaders = Object.keys(ads[0]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredAds, setFilteredAds] = useState(ads);

	const totalSpend = filteredAds.reduce((acc, item) => acc + item.spend, 0);
	const totalImpressions = filteredAds.reduce((acc, item) => acc + item.impressions, 0);
	const totalClicks = filteredAds.reduce((acc, item) => acc + item.outboundClicks, 0);
	const totalPageViews = filteredAds.reduce((acc, item) => acc + item.pageViews, 0);
	const totalPurchasesConversions = filteredAds.reduce((acc, item) => acc + item.purchasesConversionValue, 0).toFixed(2);
	const totalPurchases = filteredAds.reduce((acc, item) => acc + item.purchases, 0);

	useEffect(() => {
		const filteredData = ads.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
		setFilteredAds(filteredData);
	}, [ads, searchTerm]);

	return (
		<>
			<PageTitle>Criativos</PageTitle>
			<p className="subtitle">
				Aqui você tem uma visualização geral de todos os seus criativos ativos pertencentes a campanhas ativas do Facebook Ads. Você pode buscar e agrupar por nome de anúncios para ter uma visão melhor da performance de criativos duplicados!
			</p>
			<Input
				name="ad-name"
				type="text"
				placeholder="agrupar por nome de anuncio"
				className="w-full my-8"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<table className="w-full mb-12">
				<thead>
					<tr>
						{tableHeaders.map((header: string) => header != 'id' && (<th key={header}>{header}</th>))}
					</tr>
				</thead>
				<tbody>
					{filteredAds.map((ad: any) => (
						<tr key={ad.id}>
							{tableHeaders.map(header => header != 'id' && (
								<td key={header} className="p-2 border border-purple" >
									{typeof ad[header] === 'number' ?
										['impressions', 'outboundClicks', 'pageViews', 'purchases'].includes(header) ?
											ad[header] :
											ad[header].toFixed(2)
										: ad[header]}
								</td>
							))}
						</tr>
					))}
					<tr>
						<td className="p-2 border border-purple"><b>Total</b></td>
						<td className="p-2 border border-purple"><b>{totalSpend.toFixed(2)}</b></td>
						<td className="p-2 border border-purple"><b>{totalImpressions}</b></td>
						<td className="p-2 border border-purple"><b>{totalClicks}</b></td>
						<td className="p-2 border border-purple"><b>{totalPageViews}</b></td>
						<td className="p-2 border border-purple"><b>{totalPurchases}</b></td>
						<td className="p-2 border border-purple"><b>{totalPurchasesConversions}</b></td>
						<td className="p-2 border border-purple"><b>{(totalClicks / totalImpressions * 100).toFixed(2)}</b></td>
						<td className="p-2 border border-purple"><b>{totalPageViews != 0 ? (totalSpend / totalPageViews).toFixed(2) : 0}</b></td>
						<td className="p-2 border border-purple"><b>{totalPurchases != 0 ? (totalSpend / totalPurchases).toFixed(2) : 0}</b></td>
						<td className="p-2 border border-purple"><b>{(totalPurchasesConversions / totalSpend).toFixed(2)}</b></td>
					</tr>
				</tbody>
			</table>
		</>
	);
};
