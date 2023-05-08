import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
];

export default function StoreSelect() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [open, setOpen] = useState(false);

	// const menuTitleRef = useRef<HTMLDivElement | null>(null);
	// const menuRef = useRef<HTMLDivElement | null>(null);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setOpen(!open);
	};

	const handleOpenStoreModal = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); //impede que o dropdown de fechar
		console.log("opening modal...")
	};

	const stores = [
		"Hevo Foods",
		"Calê",
		"ShopCão"
	];

	// const calculateCollapsedScale = () => {
	// 	if (menuRef.current && menuTitleRef.current) {
	// 		const collapsed = menuTitleRef.current.getBoundingClientRect();
	// 		const expanded = menuRef.current.getBoundingClientRect();

	// 		return {
	// 			x: 1,
	// 			y: collapsed.height / expanded.height
	// 		};
	// 	} else {
	// 		return {
	// 			x: 0, y: 0
	// 		}
	// 	};
	// };

	// const createKeyframeAnimation = () => {
	// 	let { x, y } = calculateCollapsedScale();
	// 	let animation = "";
	// 	let inverseAnimation = "";

	// 	for (let step = 0; step <= 100; step++) {
	// 		let easedStep = ease(step / 100);

	// 		const xScale = x + (1 - x) * easedStep;
	// 		const yScale = y + (1 - y) * easedStep;
	// 		const invXScale = 1 / xScale;
	// 		const invYScale = 1 / yScale;

	// 		animation += `${step}% {
	//       transform: scale(${xScale}, ${yScale});
	// 		}`;

	// 		inverseAnimation += `${step}% {
	// 				transform: scale(${invXScale}, ${invYScale});
	// 		}`;
	// 	}

	// 	return `
	// 	<style>
	// 		@keyframes menuAnimation {
	// 			${animation}
	// 		}

	// 		@keyframes menuContentsAnimation {
	// 			${inverseAnimation}
	// 		}
	// 	</style>
	//   `;
	// };

	// const ease = (v: number, pow = 4) => 1 - Math.pow(1 - v, pow);

	const selectedStoreMarkdown = (
		<div
			// ref={menuTitleRef}
			className={`
			w-full 
			flex items-center justify-between py-4 
			${open ? "font-semibold" : ""}`
			}>
			{stores[selectedIndex]}
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
								{store}
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

	// useEffect(() => {
	// 	const style = document.createElement("style");
	// 	document.head.appendChild(style);
	// 	style.textContent = createKeyframeAnimation();
	// }, []);

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
