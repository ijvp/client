import type { LinksFunction } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import { Outlet } from "@remix-run/react";
import Sidebar, {
	links as sidebarLinks
} from "~/components/sidebar";

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export default function App() {
	return (
		<AppProvider i18n={{}}>
			<Sidebar />
			<div className="py-20 px-24 h-full w-full">
				<Outlet />
			</div>
		</AppProvider>
	)
}
