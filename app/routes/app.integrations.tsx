import type { V2_MetaFunction, LinksFunction } from "@remix-run/node";
import IntegrationBox from "~/components/integration-box";
import Sidebar, { links as sidebarLinks } from "~/components/sidebar";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Integrações" }];
};

export const links: LinksFunction = () => [
	...sidebarLinks()
];

export default function Integrations() {
	return (
		<div>
			<h1 className="h2 border-b border-solid border-black-secondary pb-[27px] mb-[27px]">Integrações</h1>
			<div>
				<div className="mt-[60px]">
					<h2 className="h5 pb-8">E-Commerce:</h2>
					<div className="grid grid-cols-2 gap-6">
						<IntegrationBox 						
							connected={true}
						/>
							<IntegrationBox 						
							connected={false}
						/>
							<IntegrationBox 
							connected={false}
						/>
						<IntegrationBox 
							connected={false}
						/>
					</div>
				</div>
				<div className="mt-[60px]">
					<h2 className="h5 pb-8">Anúncios:</h2>
					<div className="grid grid-cols-2 gap-6">
						<IntegrationBox 						
							connected={false}
						/>
							<IntegrationBox 						
							connected={false}
						/>
							<IntegrationBox 
							connected={true}
						/>
						<IntegrationBox 
							connected={false}
						/>
					</div>
				</div>
				<div className="mt-[60px]">
					<h2 className="h5 pb-8">E-Mail Marketing:</h2>
					<div className="grid grid-cols-2 gap-6">
						<IntegrationBox 						
							connected={false}
						/>
							<IntegrationBox 						
							connected={false}
						/>
							<IntegrationBox 
							connected={true}
						/>
						<IntegrationBox 
							connected={false}
						/>
					</div>
				</div>
				<div className="mt-[60px]">
					<h2 className="h5 pb-8">Planilhas:</h2>
					<div className="grid grid-cols-2 gap-6">
						<IntegrationBox 						
							connected={false}
						/>
							<IntegrationBox 						
							connected={false}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}