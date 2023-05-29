import type { V2_MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { fetchShopifyProducts } from "~/api";
import { checkAuth } from "~/api/helpers";
import PageTitle from "~/components/page-title";
import ProductList from "~/components/product-list";
import { links as sidebarLinks } from "~/components/sidebar";

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

	const products = await fetchShopifyProducts(request, user);
	return json(products.map(product => { return { ...product.node } }));
};

export default function ProductsPage() {
	const products = useLoaderData();

	return (
		<>
			<PageTitle>Produtos</PageTitle>
			<div className="flex gap-16">
				<ProductList products={products} />
				<Outlet />
			</div>
		</>
	)
}