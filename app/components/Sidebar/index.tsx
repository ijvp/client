import type { MouseEvent } from "react";
import { useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { NavLink, Link } from "@remix-run/react";
import ToggleButton, { links as toggleButtonLinks } from "../toggle-button";
import StoreSelect, { links as storeSelectLinks } from "../store-select";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...toggleButtonLinks(),
	...storeSelectLinks()
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

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setOpen(!open);
	};

	return (
		<nav
			id="sidebar"
			className="
			relative
			w-[280px] h-screen
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
				{/* <div className="self-end mb-9">
					<ToggleButton open={open} onClick={handleClick} />
				</div> */}

				<div className="flex items-center gap-2 mb-8">
					<img src="/images/logo.png" alt="logo" /><p className="h6 font-semibold">Turbo <span className="text-purple">Dash</span></p>
				</div>

				<div className="mb-10 w-full">
					<StoreSelect />
				</div>


				<div className="flex flex-col w-full gap-6">
					<SidebarLink
						label="Análise"
						link="/analysis"
						src="/icons/analysis-icon.svg"
						alt="Análise"
					/>
					<SidebarLink
						label="Produtos"
						link="/products"
						src="/icons/products-icon.svg"
						alt="Produtos"
					/>
					<SidebarLink
						label="Integrações"
						link="/integrations"
						src="/icons/integrations-icon.svg"
						alt="Integrações"
					/>

				</div>
			</div>


			<div className="flex items-center justify-center gap-4">
				<div className="
				w-[60px] aspect-square
				flex items-center justify-center
				bg-yellow-500 rounded-md 
				text-2xl font-semibold">P</div>
				<div className="
				w-[60px] aspect-square 
				flex items-center justify-center
				bg-black-secondary rounded-md">
					<Link to="/settings">
						<img src="/icons/settings-icon.svg" alt="Configurações" />
					</Link>
				</div>
			</div>
		</nav>
	)
};