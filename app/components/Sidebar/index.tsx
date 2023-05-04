import { useState, MouseEvent } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function Sidebar() {
	const [open, setOpen] = useState(false);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		setOpen(!open);
	};

	return (
		<nav className="
		relative
		w-[280px] h-screen
		py-8 px-6
		flex flex-col items-start justify-start
		bg-black-bg
		border border-solid border-black-secondary rounded-r-2xl
		text-white 
	">
			<button
				onClick={handleClick}
				className="
				aspect-square w-11
				bg-black-secondary
				border border-solid border-black-secondary rounded
				flex items-center justify-center
			">
				<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`chevron ${open ? 'chevron--flip' : ''}`}>
					<g className="chevron-group">
						<path d="M1 1L6.5 6.5" stroke="#EFEFFF" stroke-width="1.5" stroke-linecap="round" className="chevron-group--top" />
						<path d="M6.5 1L1 6.5" stroke="#EFEFFF" stroke-width="1.5" stroke-linecap="round" className="chevron-group--bottom" />
					</g>
				</svg>
				<svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg" className={`chevron ${open ? 'chevron--flip' : ''}`}>
					<g className="chevron-group">
						<path d="M6.5 1L1.70711 5.79289C1.31658 6.18342 1.31658 6.81658 1.70711 7.20711L6.5 12" stroke="#EFEFFF"
							stroke-width="1.5" stroke-linecap="round" className="chevron-group--left" />
						<path d="M1.5 1L6.29289 5.79289C6.68342 6.18342 6.68342 6.81658 6.29289 7.20711L1.5 12" stroke="#EFEFFF"
							stroke-width="1.5" stroke-linecap="round" className="chevron-group--right" />
					</g>
				</svg>
			</button>
			<div className="flex items-center gap-2 mb-4">
				<img src="/images/logo.png" alt="logo" /><p className="h6 font-semibold">Turbo <span className="text-purple">Dash</span></p>
			</div>

			<div>
				<p>dropdown here</p>
			</div>

			<ul>
				<li>
					<Link to="/análise">Análise</Link>
				</li>
				<li>
					<Link to="/produtos">Produtos</Link>
				</li>
				<li>
					<Link to="/integrações">Integrações</Link>
				</li>
			</ul>

			<div>
				configurações de usuario
			</div>
		</nav>
	)
}