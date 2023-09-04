import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function FAQButton({ onclick }) {
	return (
		<div
			className="
					faq-button
					w-[60px] aspect-square 
					flex items-center justify-center
					bg-black-secondary rounded-md
				">
			<Link to="/faq" onClick={(e) => onclick(e)}>
				<img src="/icons/help.svg" className="h-6" alt="Dúvidas frequentes" />
			</Link>
		</div>
	);
};