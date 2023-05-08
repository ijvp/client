import type { V2_MetaFunction, LinksFunction } from "@remix-run/node";
import Sidebar, { links as sidebarLinks } from "~/components/sidebar";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Integrações" }];
};

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export default function Integrations() {
	return (
		<>
			This is the integrations page
		</>
	)
}