import type { MouseEvent } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";
import { useAtom } from "jotai";
import { formatStoreName } from "~/utils/store";
import AddStoreModal, { links as addShopModalLinks } from "../add-store-modal";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
import Overlay from "../overlay";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...addShopModalLinks()
];

export default function StoreSelect({ openAddStoreModal, openSidebar }) {
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const storeId = searchParams.get("store");
	const [stores] = useAtom(storesAtom);
	const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);
	const [open, setOpen] = useState(false);
	
	const handleClick = (openSidebar: boolean) => {
		if(!openSidebar) {
			const toggleButton = document.getElementById('toggle-button');
			toggleButton.click();
		};

		setOpen(!open);

		const menu = document.querySelector('.menu');
		const menuContent = document.querySelector('.menu--content');
		
		if (menu.classList.contains('menu--collapsed')) {
			const menuHeight = Array.from(menuContent.children).map(item => item.clientHeight).reduce((a, b) => a + b, 0);
			menuContent.style.height = menuHeight + 'px';
			menuContent.style.opacity = 1;
			menuContent.style.transform = "scaleY(1)";
		} else {
			menuContent.style.height = 0;
			menuContent.style.opacity = 0;
			menuContent.style.transform = "scaleY(0)";
		}
	};

	const addStoreButton = (
		<button
			onClick={openAddStoreModal}
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
		const paths = location.pathname.split("/");
		let path;
		if (paths.indexOf("products") !== paths.length - 1) {
			paths.pop();
			path = paths.join("/")
		} else {
			path = location.pathname
		}

		return `${path}?${sortedParams.toString()}`;
	};

	//Esse hook precisa ficar antes do if (!stores.length) para nao ser chamado condicionalmente
	useEffect(() => {
		if (stores?.length) {
			const index = stores.findIndex((store) => store?.name === storeId);
			index > -1 ? setSelectedIndex(index) : setSelectedIndex(0);
		}
	}, [stores, storeId, setSelectedIndex]);

	const selectedStoreMarkdown = !!stores?.length && (
		<div
			onClick={() => handleClick(openSidebar)}
			id="stores-dropdown"
			className={`w-full flex items-center justify-between py-4 bold-not-active ${open && "bold-active"}`}
		>
			<span className={`${openSidebar ? 'text-show' : 'text-hide'}`}>{formatStoreName(stores[selectedIndex]?.name)}</span>
			<img
				src="/icons/chevron-right.svg"
				alt="chevron-right"
				className={`transition-transform ${open ? "rotate-90" : ""}`}
			/>
		</div>
	);

	const storeOptionsMarkdown = !!stores?.length && (
		<div>
			{stores.map((store, index) => {
				if (store !== stores[selectedIndex]) {
					return (
						<div key={index} className="w-full last:border-b last:border-black-secondary">
							<Link to={handleStoreSelect(store?.name)} style={{ display: "block", padding: "1rem 0", color: "#F2EDF9" }}>
								{formatStoreName(store?.name)}
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
		<div className="relative menu--wrapper">
			{!stores?.length ? (
				<div className="border border-solid border-black-secondary rounded-lg">
					{addStoreButton}
				</div>
			) : (
				<div
					className={`
						w-full 
						flex flex-col items-center 
						px-6 
						border border-solid border-black-secondary rounded-lg 
						cursor-pointer menu ${open ? "menu--expanded" : "menu--collapsed"}
					`}>
					{selectedStoreMarkdown}
					<div className="w-full menu--content">
						{storeOptionsMarkdown}
						{addStoreButton}
					</div>
				</div>)}
		</div>
	);
}
