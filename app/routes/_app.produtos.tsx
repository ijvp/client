import type { V2_MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { fetchProductsSessions, fetchShopifyProducts } from "~/api/shopify";
import { checkAuth } from "~/api/helpers";
import PageTitle from "~/components/page-title";
import diacritics from "diacritics";
import { links as sidebarLinks } from "~/components/sidebar";
import { fetchUserStores } from "~/api/user";
import { useAtom } from "jotai";
import { storeIndexAtom, storesAtom } from "~/utils/atoms";
import IntervalSelect from "~/components/interval-select";
import { useState } from "react";
import Input from "~/components/input";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Produtos" }];
};

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export const loader = async ({ request, params }: LoaderArgs) => {
	const user = await checkAuth(request);
	if (!user) {
		return redirect("/login");
	}

	const searchParams = new URL(request.url).searchParams;
	let store = searchParams.get("store");

	if (!store) {
		const stores = await fetchUserStores(request);

		if (stores.length) {
			store = stores[0].myshopify_domain;
		} else {
			return null;
		}
	}

	const products = await fetchShopifyProducts(request, user, store);
	return json(products);
};

export function ErrorBoundary() {
	return (
		<>
			<PageTitle>Erro ao carregar produtos</PageTitle>
			<p className="subtitle">Algo deu errado, verifique se ja adicionou alguma loja ou então tente novamente mais tarde</p>
		</>
	)
}

export default function ProductsPage() {
	const products = useLoaderData();
	const [stores] = useAtom(storesAtom);
	const [selectedIndex] = useAtom(storeIndexAtom);
	const [searchValue, setSearchValue] = useState("");
	const [searchParams] = useSearchParams();
	const searchParamsObj = Object.fromEntries(searchParams);

	const normalizedSearchValue = diacritics.remove(searchValue.toLowerCase());
	const filteredProducts = products?.filter(product => {
		const normalizedProductName = diacritics.remove(product.title?.toLowerCase());
		return normalizedProductName.includes(normalizedSearchValue);
	});

	if (!stores?.length) {
		return (
			<>
				<PageTitle>Produtos</PageTitle>
				<p className="subtitle">Você não tem uma loja cadastrada ainda, conecte uma loja shopify para começar!</p>
			</>

		)
	}

	if (!products?.length) {
		return (
			<>
				<PageTitle>Produtos</PageTitle>
				<p className="subtitle">Sua loja não tem produtos cadastrados ainda!</p>
			</>

		)
	}

	return (
		<>
			<PageTitle>Produtos</PageTitle>
			<IntervalSelect />
			<div className="flex gap-8">
				{products.length > 0 &&
					<div className="w-full">
						<Input
							type="text"
							name="product-name"
							placeholder="Buscar"
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							className="px-2 py-1 border rounded w-full"
						/>
						<div className="mt-6 flex flex-col items-start justify-center gap-4 w-full">
							{
								filteredProducts.map((product: any, index: number) => {
									const productId = String(product.id).split("/").slice(-1);

									return (
										<Link to={
											{
												pathname: `/produtos/${productId}`,
												search: new URLSearchParams(searchParamsObj).toString()
											}}
											key={index} className="w-full flex items-center justify-between md:p-4 gap-2 rounded border border-black-secondary bg-black-bg text-white">
											<div className="flex items-center gap-2 md:gap-4 max-md:pl-2 max-md:py-2">
												<div className="w-20 h-20">
													<img
														src={product.featuredImage?.url}
														alt={product.featuredImage?.altText}
														className="h-full w-full object-contain rounded-sm" />
												</div>
												<p className="text-md md:text-xl font-medium w-min"><span>{product.title}</span> ({productId})</p>
											</div>
											<div className="max-md:hidden bg-purple px-6 py-4 text-center flex items-center justify-center font-bold text-white rounded-md">
												<span>Ver detalhes</span>
											</div>
											<div className="md:hidden bg-purple px-4 self-stretch text-center flex items-center justify-center font-bold text-white rounded-r-md">
												<img src="/icons/eye.svg"/>
											</div>
										</Link>
									)
								})
							}
						</div>
					</div>
				}
				{/* <ProductList products={products} /> */}
				<Outlet />
			</div >
		</>
	)
}