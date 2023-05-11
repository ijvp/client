import { MouseEvent, useEffect } from "react";
import { useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { useAtom } from "jotai";
import { formatStoreName } from "~/utils/store";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
];

export default function StoreSelect() {
	const [stores, setStores] = useAtom(storesAtom);
	const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);
	const [open, setOpen] = useState(false);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setOpen(!open);
	};

	const handleOpenStoreModal = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); //impede que o dropdown de fechar
		console.log("opening modal...")
	};

	const selectedStoreMarkdown = (
		<div
			className={`
			w-full 
			flex items-center justify-between py-4 
			${open ? "font-semibold" : ""}`
			}>
			{formatStoreName(stores[selectedIndex].name)}
			<img src="/icons/chevron-left.svg" alt="chevron-left" className={`transition-transform ${open ? "-rotate-90" : ""}`} />
		</div>
	);

	const storeSelectMarkdown = (
		<div>
			{
				stores.map((store, index) => {
					if (store !== stores[selectedIndex]) {
						return (
							<button
								key={index}
								className="w-full py-4 text-left"
								onClick={() => setSelectedIndex(index)}
							>
								{formatStoreName(store.name)}
							</button>
						)
					} else {
						return null;
					}
				})
			}
		</div>
	);

	const addStoreButtonMarkdown = (
		<button
			onClick={handleOpenStoreModal}
			className="w-full
			py-4
			flex items-center justify-center gap-5 
			border-t border-solid border-black-secondary 
		">
			Adicionar loja
			<img src="/icons/add.svg" alt="add-icon" />
		</button>
	);

	return (
		//Tenho que usar uma div aqui pq nao posso colocar botões dentro
		//de outros botões. Por enquanto o TS vai continuar reclamando
		//desse onClick numa div...
		<div
			// ref={menuRef}
			onClick={handleClick}
			className={`
				w-full
				flex flex-col items-center
				px-6 
				border border-solid border-black-secondary 
				rounded-lg
				cursor-pointer
				${!open ? "menu" : "menu--expanded"}
			`}>
			{selectedStoreMarkdown}
			{/* <div
				className={`${!open ? "menu__contents" : "menu__contents--expanded"}`}>
				{storeSelectMarkdown}
				{addStoreButtonMarkdown}
			</div> */}
			{open && (
				<div>
					{storeSelectMarkdown}
					{addStoreButtonMarkdown}
				</div>
			)}
		</div>
	);
};
