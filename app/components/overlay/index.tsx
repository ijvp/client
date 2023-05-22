import type { ReactNode } from "react";

interface OverlayProps {
	children: ReactNode
};

export default function Overlay({ children }: OverlayProps) {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-10"
			style={{ backgroundColor: "rgba(8, 5, 18, 0.6)" }}
		>
			{children}
		</div>
	)
}