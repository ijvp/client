import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function SettingsButton() {
	return (
		<div
			className="
					settings-button
					w-[60px] aspect-square 
					flex items-center justify-center
					bg-black-secondary rounded-md
				">
			<Link to="/settings">
				<img src="/icons/settings-icon.svg" alt="Configurações" />
			</Link>
		</div>
	);
};