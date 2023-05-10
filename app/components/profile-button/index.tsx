import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css"

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function ProfileButton() {
	const [profileTooltipOpen, setProfileTooltipOpen] = useState(false);

	const handleToggleProfileTooltip = () => {
		setProfileTooltipOpen(!profileTooltipOpen);
	};

	useEffect(() => {
		const handleProfileButtonClicked = (event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			if (event.currentTarget.id === "profile-button") {
				setProfileTooltipOpen(!profileTooltipOpen);
			}
		};
		document.getElementById("profile-button")?.addEventListener("click", handleProfileButtonClicked);

		const handleCloseProfileTooltip = (event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			if (
				event.target instanceof HTMLElement &&
				event.target.tagName.toLowerCase() !== "form" &&
				event.target.tagName.toLowerCase() !== "button"
			) {
				setProfileTooltipOpen(false);
			}
		};

		document.body.addEventListener("click", handleCloseProfileTooltip);
		return () => {
			document.getElementById("profile-button")?.removeEventListener("click", handleProfileButtonClicked);
			document.body.removeEventListener("click", handleCloseProfileTooltip);
		};
	}, [profileTooltipOpen]);

	return (
		<form
			className="relative w-[60px]"
			method="post"
			action="/logout"
			id="logout-form"
		>
			{profileTooltipOpen && (
				<button
					type="submit"
					form="logout-form"
					id="logout-button"
					className="
					absolute top-0 -translate-y-[125%]
					w-full
					py-2
					bg-white 
					text-black text-center 
					rounded-md 
				">
					Sair
				</button>
			)}
			<button
				onClick={handleToggleProfileTooltip}
				id="profile-button"
				type="button"
				className="
				w-[60px] aspect-square
				flex items-center justify-center
				bg-yellow-500 rounded-md 
				text-2xl font-semibold
			">
				P
			</button>
		</form>
	)
}