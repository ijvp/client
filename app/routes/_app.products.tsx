import { V2_MetaFunction, LinksFunction, LoaderArgs, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchShopifyProducts } from "~/api";
import { checkAuth } from "~/api/helpers";
import PageTitle from "~/components/page-title";
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

export default function Products() {
	const loaderData = useLoaderData();
	console.log("loader data", loaderData);
	return (
		<>
			<PageTitle>Produtos</PageTitle>
		</>
	)
}