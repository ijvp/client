import type { LinksFunction } from "@remix-run/node";
import { NavLink, useSearchParams } from "@remix-run/react";
import { links as toggleButtonLinks } from "~/components/toggle-button";
import StoreSelect, { links as storeSelectLinks } from "~/components/store-select";
import ProfileButton, { links as profileButtonLinks } from "../profile-button";
import SettingsButton, { links as settingsButtonLinks } from "../settings-button";
import { useState } from "react";
import AddStoreModal from "../add-store-modal";

export const links: LinksFunction = () => [
	...toggleButtonLinks(),
	...profileButtonLinks(),
	...settingsButtonLinks(),
	...storeSelectLinks()
];

interface LinkProps {
	label?: string,
	link: string,
	src: string,
	alt: string
};

function SidebarLink({ label, link, src, alt }: LinkProps) {
	const [searchParams] = useSearchParams();

	const store = searchParams.get("store");

	return (
		<NavLink
			to={{ pathname: link, search: store ? `?store=${store}` : "" }}
			prefetch="intent"
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
	const [openModal, setOpenModal] = useState(false);

	const handleToggleModal = () => {
		setOpenModal(!openModal);
	};

	return (
		<>
			<nav
				id="sidebar"
				className="
					sticky top-0
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
					{/* <div className="self-end mb-9">
						<ToggleButton open={open} onClick={handleClick} />
					</div> */}

					<div className="flex items-center gap-2 mb-8">
						<img src="/images/logo.png" alt="logo" /><p className="h6 font-semibold">Turbo <span className="text-purple">Dash</span></p>
					</div>

					<div className="mb-10 w-full">
						<StoreSelect openAddStoreModal={handleToggleModal} />
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
					<ProfileButton />
					<SettingsButton />
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