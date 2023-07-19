import type { V2_MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { fetchShopifyProducts } from "~/api/shopify";
import { checkAuth } from "~/api/helpers";
import PageTitle from "~/components/page-title";
import ProductList from "~/components/product-list";
import { links as sidebarLinks } from "~/components/sidebar";
import { fetchUserStores } from "~/api/user";
import { useAtom } from "jotai";
import { storesAtom } from "~/utils/atoms";

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
			store = stores[0]
			const products = await fetchShopifyProducts(request, user, store);
			return json(products);
		}
	};
};

// 	return null;
// };

export function ErrorBoundary() {
	return (
		<>
			<PageTitle>Erro ao carregar produtos</PageTitle>
			<p className="subtitle">Algo deu errado, verifique se ja adicionou alguma loja ou então tente novamente mais tarde</p>
		</>
	)
};

export default function ProductsPage() {
	const products = useLoaderData();
	const [stores] = useAtom(storesAtom);

	if (!stores?.length) {
		return (
			<>
				<PageTitle>Produtos</PageTitle>
				<p className="subtitle">Você não tem uma loja cadastrada ainda, conecte uma loja shopify para começar!</p>
			</>

		)
	};

	if (!products?.length) {
		return (
			<>
				<PageTitle>Produtos</PageTitle>
				<p className="subtitle">Sua loja não tem produtos cadastrados ainda!</p>
			</>

		)
	};
	return (
		<>
			<PageTitle>Produtos</PageTitle>
			<div className="flex gap-16">
				{products.length > 0 &&
					<div className="flex flex-col items-start justify-center gap-4">
						{
							products.map((product: any, index: number) => {
								return (
									<div key={index} className="w-full flex items-center gap-2">
										<img src={product.featuredImage?.url} alt={product.featuredImage?.altText} className="w-[100px] aspect-square" />
										<span>{product.title}</span>
										<span>{product.handle}</span>
									</div>
								)
							})
						}
					</div>
				}
				{/* <ProductList products={products} /> */}
				<Outlet />
			</div>
		</>
	)
}