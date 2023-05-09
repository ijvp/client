import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css"

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function ProfileButton() {
	const [profileTooltipOpen, setProfileTooltipOpen] = useState(false);

	const handleCloseProfileTooltip = (event: MouseEvent<HTMLElement>) => {
		if (event.currentTarget.id !== "logout-button") {
			setProfileTooltipOpen(false);
		}
	};

	const handleLogout = () => {
		console.log("Logging out...");
		setProfileTooltipOpen(false);
	};

	useEffect(() => {
		// Add event listener to close tooltip if the user clicks on the profile button again
		const handleProfileButtonClicked = (event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			if (event.currentTarget.id === "profile-button") {
				setProfileTooltipOpen(!profileTooltipOpen);
			}
		};
		document.getElementById("profile-button")?.addEventListener("click", handleProfileButtonClicked);

		document.body.addEventListener("click", handleCloseProfileTooltip);
		return () => {
			document.getElementById("profile-button")?.removeEventListener("click", handleProfileButtonClicked);
			document.body.removeEventListener("click", handleCloseProfileTooltip);
		}
	}, [profileTooltipOpen]);

	return (
		<div className="relative w-[60px]">
			{profileTooltipOpen && (
				<button
					onClick={handleLogout}
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
				id="profile-button"
				className="
						w-[60px] aspect-square
						flex items-center justify-center
						bg-yellow-500 rounded-md 
						text-2xl font-semibold"
			>
				P
			</button>
		</div>
	)
}