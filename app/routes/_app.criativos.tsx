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
	const [open, setOpen] = useState(false);
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
				text-left 
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
				<span>Criativos</span>
				<Suspense fallback={<p>Carregando...</p>}>
					<div className="text-sm md:text-lg flex items-center justify-start gap-2">
						<Await resolve={ttl} errorElement={
							<>
								<div className="w-4 h-4 aspect-square bg-red-light rounded-full" />
								<p>Não foi possível atualizar</p>
							</>
						}>
							{() =>
								navigation.state === "idle" ? (
									<>
										<div className="w-2 md:w-4 h-2 md:h-4 aspect-square bg-green-light rounded-full" />
										<p>{lastUpdate > 0 ? `Atualizado há ${lastUpdate > 1 ? lastUpdate + ' minutos' : lastUpdate + ' minuto'} ` : "Atualizado há menos de 1 minuto"}</p>
									</>
								) : navigation.state === "loading" ? (
									<p>Carregando...</p>
								) : null}
						</Await>
					</div>
				</Suspense>
			</PageTitle>

			<IntervalSelect />
			<div className="grid grid-cols-4 gap-6">
				<div className="flex flex-col col-start-1 col-end-5 xl:col-end-4 row-start-1">
					<p className="text-xl text-[#FFF]">Agrupar por nome do anúncio</p>
					<Input
						name="ad-name"
						type="text"
						placeholder="Nome do anúncio"
						className="w-full mt-4"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="flex col-start-1 col-end-5 xl:col-end-4 row-start-3 xl:row-start-2">
					<Suspense fallback={<ChartsSkeleton />}>
						<Await resolve={ads} errorElement={<h2 className="h4 my-12">Parece que algo deu errado, tente buscar dados de outro periodo ou recarregue a página</h2>}>
							{() =>
								navigation.state === "idle" ? (
									<div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
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
				<div className="flex flex-col col-start-1 col-end-5 xl:col-start-4 row-start-2 xl:row-start-1 row-end-3">
					<AdInsightsControls
						columnOptions={columnOptions}
						selectedColumns={selectedColumns}
						setSelectedColumns={setSelectedColumns}
					/>
					<div className={`flex flex-col relative ${open ? 'h-fit' : 'h-[232px] xl:h-fit overflow-hidden'}`}>
						{!open && (
							<div className="xl:hidden gradient-filter absolute bottom-0 left-0 w-full h-[180px]"></div>
						)}
						<p className="text-xl mt-6 mb-2 text-[#FFF]">Análise geral</p>
						{selectedColumnCells}
					</div>
					<div className="flex xl:hidden w-full max-w-[350px] self-center h-15 px-6 py-4 justify-center items-center border border-purple rounded-lg text-purple font-bold leading-normal cursor-pointer" onClick={() => setOpen(!open)}>
						{open ? (
							<span>Visualizar menos</span>
						) : (
							<span>Visualizar por completo</span>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
