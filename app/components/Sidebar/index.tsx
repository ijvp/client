import { useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { NavLink, Link } from "@remix-run/react";
import ToggleButton, { links as toggleButtonLinks } from "~/components/toggle-button";
import StoreSelect, { links as storeSelectLinks } from "~/components/store-select";
import ProfileButton, { links as profileButtonLinks } from "../profile-button";

export const links: LinksFunction = () => [
	...toggleButtonLinks(),
	...storeSelectLinks(),
	...profileButtonLinks()
];

interface LinkProps {
	label?: string,
	link: string,
	src: string,
	alt: string
};

function SidebarLink({ label, link, src, alt }: LinkProps) {
	return (
		<NavLink
			to={link}
			className={({ isActive, isPending }) =>
				isActive ? "flex items-center p-4 h-[60px] w-full bg-black-secondary rounded-lg text-white" : "flex items-center p-4 h-[60px] w-full rounded-lg text-gray"
			}>
			<div className="w-7 flex items-center justify-center mr-3">
				<img src={src} alt={alt} />
			</div>
			{label}
		</NavLink >
	)
};

export default function Sidebar() {
	const [open, setOpen] = useState(false);


	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<nav
			id="sidebar"
			className="
			relative
			min-w-[280px] max-w-[280px] h-screen
			border-box
			py-8 px-6
			flex flex-col items-center justify-between
			bg-black-bg
			border border-solid border-black-secondary rounded-r-2xl
			text-white 
		">
			<div className="
				w-full
				flex flex-col items-center justify-start
			">
				<div className="self-end mb-9">
					<ToggleButton open={open} onClick={handleClick} />
				</div>

				<div className="flex items-center gap-2 mb-8">
					<img src="/images/logo.png" alt="logo" /><p className="h6 font-semibold">Turbo <span className="text-purple">Dash</span></p>
				</div>

				<div className="mb-10 w-full">
					<StoreSelect />
				</div>


				<div className="flex flex-col w-full gap-6">
					<SidebarLink
						label="Análise"
						link="/app/analysis"
						src="/icons/analysis-icon.svg"
						alt="Análise"
					/>
					<SidebarLink
						label="Produtos"
						link="/app/products"
						src="/icons/products-icon.svg"
						alt="Produtos"
					/>
					<SidebarLink
						label="Integrações"
						link="/app/integrations"
						src="/icons/integrations-icon.svg"
						alt="Integrações"
					/>
				</div>
			</div>
			<div className="flex items-center justify-center gap-4">
				<ProfileButton />
				<div className="
				w-[60px] aspect-square 
				flex items-center justify-center
				bg-black-secondary rounded-md">
					<Link to="/app/settings">
						<img src="/icons/settings-icon.svg" alt="Configurações" />
					</Link>
				</div>
			</div>
		</nav>
	)
};