import type { MouseEvent } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { useAtom } from "jotai";
import { formatStoreName } from "~/utils/store";
import AddShopModal, { links as addShopModalLinks } from "../add-shop-modal";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "@remix-run/react";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...addShopModalLinks()
];

export default function StoreSelect() {
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const storeId = searchParams.get("store");
	const [stores] = useAtom(storesAtom);
	const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	const handleOpenStoreModal = (event: MouseEvent<HTMLButtonElement>) => {
		// event.stopPropagation(); //impede que o dropdown de fechar
		setIsModalOpen(true);
	};

	const handleCloseStoreModel = () => {
		setIsModalOpen(false);
	};

	const addStoreButton = (
		<button
			onClick={handleOpenStoreModal}
			className="w-full py-4 flex items-center justify-center gap-5"
		>
			Adicionar loja
			<img src="/icons/add.svg" alt="add-icon" />
		</button>
	);

	const handleStoreSelect = (storeName: string) => {
		const queryParams = new URLSearchParams(searchParams);
		queryParams.set("store", storeName);
		const sortedParams = new URLSearchParams([...queryParams.entries()].sort((a, b) => b[0].localeCompare(a[0])));

		return `${location.pathname}?${sortedParams.toString()}`;
	};

	//Esse hook precisa ficar antes do if (!stores.length) para nao ser chamado condicionalmente
	useEffect(() => {
		if (stores?.length) {
			const index = stores.findIndex((store) => store?.name === storeId);
			index > -1 ? setSelectedIndex(index) : setSelectedIndex(0);
		}
	}, [stores, storeId]);

	if (!stores?.length) {
		return (addStoreButton)
	};

	const selectedStoreMarkdown = (
		<div
			onClick={handleClick}
			className={`w-full flex items-center justify-between py-4 ${open ? "font-semibold" : ""
				}`}
		>
			{formatStoreName(stores[selectedIndex]?.name)}
			<img
				src="/icons/chevron-left.svg"
				alt="chevron-left"
				className={`transition-transform ${open ? "-rotate-90" : ""}`}
			/>
		</div>
	);

	const storeOptionsMarkdown = (
		<div>
			{stores.map((store, index) => {
				if (store !== stores[selectedIndex]) {
					return (
						<div key={index} className="w-full last:border-b last:border-black-secondary">
							<Link to={handleStoreSelect(store.name)} style={{ display: "block", padding: "1rem 0", color: "#F2EDF9" }}>
								{formatStoreName(store.name)}
							</Link>
						</div>
					);
				} else {
					return null;
				}
			})}
		</div>
	);

	return (
		<div
			// onClick={handleClick}
			className={`w-full flex flex-col items-center px-6 border border-solid border-black-secondary rounded-lg cursor-pointer ${open ? "menu--expanded" : "menu"
				}`}
		>
			{selectedStoreMarkdown}
			{open && (
				<div className="w-full">
					{storeOptionsMarkdown}
					{addStoreButton}
				</div>
			)}

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal">
						<AddShopModal
							onClickCloseStoreModel={handleCloseStoreModel}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
