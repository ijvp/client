import type { LinksFunction } from "@remix-run/node";
import { NavLink, useSearchParams } from "@remix-run/react";
import ToggleButton from "~/components/toggle-button";
import { links as toggleButtonLinks } from "~/components/toggle-button";
import StoreSelect, { links as storeSelectLinks } from "~/components/store-select";
import ProfileButton, { links as profileButtonLinks } from "../profile-button";
import SettingsButton, { links as settingsButtonLinks } from "../settings-button";
import { Component, useState } from "react";
import AddStoreModal from "../add-store-modal";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	...toggleButtonLinks(),
	...profileButtonLinks(),
	...settingsButtonLinks(),
	...storeSelectLinks(),
	{ rel: "stylesheet", href: styles }
];

interface LinkProps {
	label?: string,
	link: string,
	alt: string,
	open: boolean,
	src: string
};

function SidebarLink({ label, link, src, alt, open }: LinkProps) {
	const [searchParams] = useSearchParams();

	const store = searchParams.get("store");

	return (
		<NavLink
			to={{ pathname: link, search: store ? `?store=${store}` : "" }}
			prefetch="intent"
			className={({ isActive, isPending }) =>
				isActive ? `flex items-center ${open ? 'px-6' : 'px-2.5 justify-center'} h-[60px] w-full bg-black-secondary rounded-lg text-white` : `flex items-center ${open ? 'px-6' : 'px-2.5 justify-center'} h-[60px] w-full rounded-lg text-gray`
			}>
			<div className={`${open ? 'w-7 mr-3' : 'w-10'} flex items-center justify-center`}>
				<img src={src} alt={alt} className="w-full h-auto" />
			</div>
			<span className={`${open ? 'text-show' : 'text-hide'}`}>{label}</span>
		</NavLink >
	)
};

export default function Sidebar() {
	const [openModal, setOpenModal] = useState(false);
	const [open, setOpen] = useState(true);

	const handleToggleModal = () => {
		setOpenModal(!openModal);
	};

	const handleClick = () => {
		if (document.querySelector('.menu--expanded')) {
			const dropdownButton = document.getElementById('stores-dropdown');
			dropdownButton.click();
		};

		setOpen(!open);
	};

	return (
		<>
			<nav
				id="sidebar"
				className={`
					gap-5
					sticky top-0
					h-screen
					border-box
					py-8
					flex flex-col items-center justify-between
					bg-black-bg
					border border-solid border-black-secondary rounded-r-2xl
					text-white menu-transition ${open ? "min-w-[280px] max-w-[280px] px-6" : "min-w-[142px] max-w-[142px] px-10"}
				`}>
				<div className="
					w-full
					flex flex-col items-center justify-start
				">
					<div className={`self-end mb-9 relative menu-transition ${open ? 'right-0' : 'right-1/2 translate-x-1/2'}`}>
						<ToggleButton open={open} onClick={handleClick} />
					</div>

					<div className={`flex items-center mb-8 h-[60px] ${!open && 'w-full'}`}>
						<img src="/images/logo.png" alt="logo" className={`menu-transition ${open ? "image-text mr-2" : "full-image"}`} />
						<p className={`h6 font-semibold ${open ? 'text-show' : 'text-hide'}`}>Turbo <span className="text-purple">Dash</span></p>
					</div>

					<div className="mb-10 w-full">
						<StoreSelect openAddStoreModal={handleToggleModal} openSidebar={open} />
					</div>


					<div className="flex flex-col w-full gap-5">
						<SidebarLink
							label="Análise"
							link="/analise"
							src="/icons/analysis-icon.svg"
							alt="Análise"
							open={open}
						/>
						<SidebarLink
							label="Produtos"
							link="/produtos"
							src="/icons/products-icon.svg"
							alt="Produtos"
							open={open}
						/>
						<SidebarLink
							label="Criativos"
							link="/criativos"
							src="/icons/creatives-icon.svg"
							alt="Criativos"
							open={open}
						/>
						<SidebarLink
							label="Integrações"
							link="/integracoes"
							src="/icons/integrations-icon.svg"
							alt="Integrações"
							open={open}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4 w-full">
					<div className="flex flex-wrap items-center justify-center gap-4">
						<ProfileButton />
						<SettingsButton />
					</div>
					<div className="w-full flex flex-col items-center justify-center gap-1 border-t-2 pt-2 border-black-secondary">
						<a className={`text-white ${open ? 'text-show' : 'text-hide'}`} href="/termos-de-uso">Termos de Uso</a>
						<a className={`text-white ${open ? 'text-show' : 'text-hide'}`} href="/politica-de-privacidade">Política de privacidade</a>
						<button onClick={handleClick} className={`${open ? 'text-hide' : 'text-show'}`}>...</button>
					</div>
				</div>
			</nav>
			{openModal && (
				<AddStoreModal
					onClick={handleToggleModal}
				/>
			)}
		</>
	);
};
