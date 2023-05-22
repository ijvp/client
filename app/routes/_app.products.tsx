import type { V2_MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
	const authenticated = await checkAuth(request);
	if (!authenticated) {
		return redirect("/login");
	}

	return null;
};
export default function Products() {
	return (
		<>
			<PageTitle>Produtos</PageTitle>
		</>
	)
}