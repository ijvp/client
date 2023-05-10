import { V2_MetaFunction, LinksFunction, LoaderArgs, redirect } from "@remix-run/node";
import { checkAuth } from "~/api/helpers";
import Sidebar, { links as sidebarLinks } from "~/components/sidebar";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Integrações" }];
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
export default function Integrations() {
	return (
		<>
			This is the integrations page
		</>
	)
}