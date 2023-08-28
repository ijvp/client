import type { V2_MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { fetchShopifyProducts } from "~/api/shopify";
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

export const loader = async ({ request }: LoaderArgs) => {
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

	const normalizedSearchValue = diacritics.remove(searchValue.toLowerCase());
	const filteredProducts = products.filter(product => {
		const normalizedProductName = diacritics.remove(product.title.toLowerCase());
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
										<div key={index} className="w-full flex items-center justify-between gap-2">
											<div className="flex items-center gap-4">
												<div className="rounded-md overflow-clip">
													<img
														src={product.featuredImage?.url}
														alt={product.featuredImage?.altText} className="w-[100px] aspect-square" />
												</div>
												<p className="subtitle h6">{product.title} ({productId})</p>
											</div>
											<Link to={`/produtos/${productId}?store=${stores[selectedIndex].myshopify_domain}`}
												className="bg-purple py-3 px-12 text-center flex items-center font-semibold text-white rounded-md">Ver detalhes</Link>
										</div>
									)
								})
							}
						</div>
					</div>
				}
				{/* <ProductList products={products} /> */}
				<Outlet />
			</div>
		</>
	)
}