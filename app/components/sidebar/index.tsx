import type { LinksFunction } from "@remix-run/node";
import { NavLink, useSearchParams } from "@remix-run/react";
import ToggleButton from "~/components/toggle-button";
import { links as toggleButtonLinks } from "~/components/toggle-button";
import StoreSelect, { links as storeSelectLinks } from "~/components/store-select";
import ProfileButton, { links as profileButtonLinks } from "../profile-button";
import SettingsButton, { links as settingsButtonLinks } from "../settings-button";
import FAQButton, { links as faqButtonLinks } from "../faq-button";
import { useState } from "react";
import AddStoreModal from "../add-store-modal";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	...toggleButtonLinks(),
	...profileButtonLinks(),
	...settingsButtonLinks(),
	...faqButtonLinks(),
	...storeSelectLinks(),
	{ rel: "stylesheet", href: styles }
];

interface LinkProps {
	label?: string,
	link: string,
	alt: string,
	open: boolean,
	src: string,
	onclick: (e) => void
};

function SidebarLink({ label, link, src, alt, open, onclick }: LinkProps) {
	const [searchParams] = useSearchParams();

	const store = searchParams.get("store");

	return (
		<NavLink
			onClick={(e) => onclick(e)}
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

export default function Sidebar( { active } ) {
	const [openModal, setOpenModal] = useState(false);
	const [open, setOpen] = useState(true);
	const [searchParams] = useSearchParams();

	const store = searchParams.get("store");

	const handleToggleModal = () => {
		setOpenModal(!openModal);
	};

	const handleClick = (e) => {
		if (document.querySelector('.menu--expanded')) {
			const dropdownButton = document.getElementById('stores-dropdown');
			dropdownButton.click();
		};
		setOpen(!open);
	};

	return (
		<>

			<div className="flex justify-between items-center w-full fixed top-0 left-0 h-28 py-8 px-6 md:px-10 z-[2] blur-menu md:hidden" >
				<NavLink to={{ pathname: "/analise", search: store ? `?store=${store}` : "" }} className="flex items-center gap-2 pointer">
					<img src="/images/logo.png" alt="logo" className={`menu-transition ${active ? 'w-12' : 'w-8'}`}/>
					{!active && (<p className="h6 font-semibold text-white">Turbo <span className="text-purple">Dash</span></p>)}
				</NavLink>
				<ToggleButton open={open} onClick={(e) => handleClick(e)} hamburguer={true}/>
			</div>
			{open && (
				<div className="blur-menu w-full fixed right-0 top-0 h-screen z-[2] md:hidden">
				</div>
			)}
			<nav
			id="sidebar"
			className={`
				gap-5
				fixed
				right-0
				z-10
				md:sticky top-0
				h-screen
				border-box
				py-8
				flex flex-col items-center justify-between
				bg-black-bg
				overflow-y-scroll hide-scrollbar
				border border-solid border-black-secondary rounded-r-2xl
				text-white menu-transition ${open ? "min-w-[280px] max-w-[280px] px-6 translate-x-0" : "min-w-[142px] max-w-[142px] px-10 translate-x-full md:translate-x-0"}
			`}>
				<div className="
					w-full
					flex flex-col items-center justify-start
				">
					<div className={`w-full flex justify-between items-center gap-4 mb-9 relative menu-transition ${open ? 'right-0 md:justify-end' : 'right-1/2 translate-x-1/2 md:justify-center'}`}>
						<NavLink to={{ pathname: "/analise", search: store ? `?store=${store}` : "" }} className="flex md:hidden pointer items-center h-[60px] w-max" onClick={(e) => handleClick(e)}>
							<img src="/images/logo.png" alt="logo" className={`menu-transition ${open ? "image-text mr-2" : "full-image"}`}/>
							<p className="h6 font-semibold text-white">Turbo <span className="text-purple">Dash</span></p>
						</NavLink>
						<ToggleButton open={open} onClick={(e) => handleClick(e)} />
					</div>

					<NavLink to={{ pathname: "/analise", search: store ? `?store=${store}` : "" }} className={`flex max-md:hidden pointer items-center mb-8 h-[60px] ${!open && 'w-full'}`} onClick={(e) => handleClick(e)}>
						<img src="/images/logo.png" alt="logo" className={`menu-transition ${open ? "image-text mr-2" : "full-image"}`}/>
						<p className={`h6 font-semibold text-white ${open ? 'text-show' : 'text-hide'}`}>Turbo <span className="text-purple">Dash</span></p>
					</NavLink>

					<div className="mb-10 w-full">
						<StoreSelect openAddStoreModal={handleToggleModal} openSidebar={open} onclick={(e) => handleClick(e)}/>
					</div>


					<div className="flex flex-col w-full gap-5">
						<SidebarLink
							label="Análise"
							link="/analise"
							src="/icons/analysis-icon.svg"
							alt="Análise"
							open={open}
							onclick={(e) => handleClick(e)}
						/>
						<SidebarLink
							label="Produtos"
							link="/produtos"
							src="/icons/products-icon.svg"
							alt="Produtos"
							open={open}
							onclick={(e) => handleClick(e)}
						/>
						<SidebarLink
							label="Criativos"
							link="/criativos"
							src="/icons/creatives-icon.svg"
							alt="Criativos"
							open={open}
							onclick={(e) => handleClick(e)}
						/>
						<SidebarLink
							label="Integrações"
							link="/integracoes"
							src="/icons/integrations-icon.svg"
							alt="Integrações"
							open={open}
							onclick={(e) => handleClick(e)}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4 w-full">
					<div className="flex flex-wrap items-center justify-center gap-4">
						<ProfileButton />
						<SettingsButton onclick={(e) => handleClick(e)}/>
						<FAQButton onclick={(e) => handleClick(e)}/>
					</div>
					<div className="w-full flex flex-col items-center justify-center gap-1 border-t-2 pt-2 border-black-secondary">
						<a className={`text-white ${open ? 'text-show' : 'text-hide'}`} href="/termos-de-uso">Termos de Uso</a>
						<a className={`text-white ${open ? 'text-show' : 'text-hide'}`} href="/politica-de-privacidade">Política de privacidade</a>
						<button onClick={(e) => handleClick(e)} className={`${open ? 'text-hide' : 'text-show'}`}>...</button>
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
