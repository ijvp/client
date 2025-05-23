import type { MouseEvent } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

type ClickHandler = (event: MouseEvent<HTMLButtonElement>) => void;

interface ToggleButtonProps {
	open: boolean;
	onClick: ClickHandler;
	hamburguer?: boolean;
};

export default function ToggleButton({ open, onClick, hamburguer }: ToggleButtonProps) {
	return (
		<button
			onClick={onClick}
			aria-label="toggle menu"
			id="toggle-button"
			className="
			h-11 w-11
			bg-black-secondary
			border border-solid border-black-secondary rounded
			flex items-center justify-center
		">
			{hamburguer ? (
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M13 1H1" stroke="#EFEFFF" strokeWidth="1.5" strokeLinecap="round"/>
					<path d="M13 7H1" stroke="#EFEFFF" strokeWidth="1.5" strokeLinecap="round"/>
					<path d="M13 13H1" stroke="#EFEFFF" strokeWidth="1.5" strokeLinecap="round"/>
				</svg>
			) : (
				<svg version="1.1" viewBox="0 0 10 4" xmlns="http://www.w3.org/2000/svg" width="8px" height="5px" className={`chevron ${open ? "" : "chevron--flip"}`}>
					<g className="chevron__group">
						<path stroke="#EFEFFF" fill="#EFEFFF" d="M1.30834787,0.121426937 L4.87569247,3.68780701 C5.04143584,3.8541036 5.04143584,4.11557261 4.87569247,4.2818692 L4.2807853,4.87693487 C4.20364253,4.95546204 4.09599241,5 3.98333171,5 C3.87067101,5 3.76302089,4.95546204 3.68587812,4.87693487 L0.122730401,1.30754434 C-0.0409101338,1.14044787 -0.0409101338,0.880578628 0.122730401,0.713482155 L0.718686793,0.119419971 C0.79596299,0.0427616956 0.902628913,-0.000376468522 1.01396541,2.47569236e-06 C1.1253019,0.000381419907 1.2316441,0.0442445771 1.30834787,0.121426937 L1.30834787,0.121426937 Z" className="chevron__box chevron__box--left" />
						<path stroke="#EFEFFF" fill="#EFEFFF" d="M3.12493976,3.68899585 L6.68683713,0.123119938 C6.76404711,0.0445502117 6.8717041,3.56458529e-15 6.98436032,0 C7.09701655,-3.56458529e-15 7.20467353,0.0445502117 7.28188351,0.123119938 L7.87588228,0.717098143 C8.04137257,0.883371226 8.04137257,1.14480327 7.87588228,1.31107635 L4.31398491,4.87695226 C4.23695994,4.95546834 4.1294742,5 4.01698553,5 C3.90449685,5 3.79701111,4.95546834 3.71998614,4.87695226 L3.12493976,4.28197072 C2.95998402,4.11649361 2.95814736,3.85659624 3.12074929,3.68899585 L3.12493976,3.68899585 Z" className="chevron__box chevron__box--right" />
					</g>
				</svg>
			)}
			
		</button>
	)
}
