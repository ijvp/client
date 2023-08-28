import type { LoaderArgs } from "@remix-run/node";
import { defer, redirect } from "@remix-run/node";
import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState, useMemo, Suspense } from "react";
import { fetchActiveConnections } from "~/api";
import { fetchFacebookAdsInsights } from "~/api/facebook";
import { checkAuth } from "~/api/helpers";
import { fetchUserStores } from "~/api/user";
import AdInsightsCard from "~/components/ad-insights-card";
import AdInsightsControls from "~/components/ad-insights-controls";
import ChartsSkeleton from "~/components/charts-skeleton";
import Input from "~/components/input";
import IntervalSelect from "~/components/interval-select";
import PageTitle from "~/components/page-title";
import { Headers } from "~/ts/enums";

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
			store = stores[0].myshopify_domain;
		} else {
			return null;
		}
	};

	const connections = await fetchActiveConnections({ request });
	const adInsightsData = connections?.facebook_ads && await fetchFacebookAdsInsights(request, user, store);
	return defer(adInsightsData);
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
	const { adInsights: ads, ttl } = useLoaderData();
	const navigation = useNavigation();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredAds, setFilteredAds] = useState(ads);

	const totalSpend = filteredAds?.reduce((acc, item) => acc + item.spend, 0);
	const totalImpressions = filteredAds?.reduce((acc, item) => acc + item.impressions, 0);
	const totalClicks = filteredAds?.reduce((acc, item) => acc + item.outboundClicks, 0);
	const totalPageViews = filteredAds?.reduce((acc, item) => acc + item.pageViews, 0);
	const totalPurchasesConversions = filteredAds?.reduce((acc, item) => acc + item.purchasesConversionValue, 0).toFixed(2);
	const totalPurchases = filteredAds?.reduce((acc, item) => acc + item.purchases, 0);

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

	const tableHeaders = useMemo(() => Object.keys(Headers), []);

	const selectedColumnCells = useMemo(() => {
		return tableHeaders.map(header => {
			return header !== "name" && selectedColumns.includes(header) && (
				<div key={header} className="
				py-4 
				flex items-center justify-between 
				text-center 
				border-b border-black-secondary last:border-0
				">
					<span>{Headers[header]}:</span>
					<b>
						{header === 'spend' ? totalSpend.toFixed(2) :
							header === 'impressions' ? totalImpressions :
								header === 'outboundClicks' ? totalClicks :
									header === 'pageViews' ? totalPageViews :
										header === 'purchases' ? totalPurchases :
											header === 'purchasesConversionValue' ? totalPurchasesConversions :
												header === 'CTR' ? (totalImpressions !== 0 ? totalClicks / totalImpressions * 100 : 0).toFixed(2) :
													header === 'CPS' ? (totalPageViews !== 0 ? (totalSpend / totalPageViews) : 0).toFixed(2) :
														header === 'CPA' ? (totalPurchases !== 0 ? (totalSpend / totalPurchases) : 0).toFixed(2) :
															header === 'ROAS' ? (totalSpend !== 0 ? totalPurchasesConversions / totalSpend : 0).toFixed(2) : ''
						}
					</b>
				</div>
			);
		});
	}, [selectedColumns, tableHeaders, totalClicks, totalImpressions, totalPageViews, totalPurchases, totalPurchasesConversions, totalSpend]);

	useEffect(() => {
		const filteredData = ads.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
		setFilteredAds(filteredData);
	}, [ads, searchTerm]);

	const lastUpdate = Math.ceil((1800 - ttl) / 60);

	return (
		<>
			<PageTitle>
				Criativos
				<div className="absolute right-2 top-1/2 -translate-y-1/2">
					<Suspense fallback={<p>Carregando...</p>}>
						<div className="subtitle flex items-center justify-start gap-2">
							<Await resolve={ttl} errorElement={
								<>
									<div className="w-4 h-4 aspect-square bg-red-light rounded-full" />
									<p>Não foi possível atualizar</p>
								</>
							}>
								{() =>
									navigation.state === "idle" ? (
										<>
											<div className="w-4 h-4 aspect-square bg-green-light rounded-full" />
											<p>{lastUpdate > 0 ? `Atualizado há ${lastUpdate > 1 ? lastUpdate + ' minutos' : lastUpdate + ' minuto'} ` : "Atualizado há menos de 1 minuto"}</p>
										</>
									) : navigation.state === "loading" ? (
										<p>Carregando...</p>
									) : null}
							</Await>
						</div>
					</Suspense>
				</div>
			</PageTitle>

			<IntervalSelect />
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-8">
					<p className="text-xl text-[#FFF]">Agrupar por nome do anúncio</p>
					<Input
						name="ad-name"
						type="text"
						placeholder="Nome do anúncio"
						className="w-full my-4"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Suspense fallback={<ChartsSkeleton />}>
						<Await resolve={ads} errorElement={<h2 className="h4 my-12">Parece que algo deu errado, tente buscar dados de outro periodo ou recarregue a página</h2>}>
							{() =>
								navigation.state === "idle" ? (
									<div className="w-full mb-12 grid grid-cols-3 gap-6">
										{filteredAds?.map((ad: any, index: number) => (
											<AdInsightsCard key={index} ad={ad} selectedColumns={selectedColumns} tableHeaders={tableHeaders} />
										))}
									</div>
								) : navigation.state === "loading" ? (
									<ChartsSkeleton />
								) : null}
						</Await>
					</Suspense>
				</div>
				<div className="col-span-4">
					<AdInsightsControls
						columnOptions={columnOptions}
						selectedColumns={selectedColumns}
						setSelectedColumns={setSelectedColumns}
					/>
					<p className="text-xl mt-6 mb-2 text-[#FFF]">Análise geral</p>
					{selectedColumnCells}
				</div>
			</div>
		</>
	);
};
