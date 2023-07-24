import type { ReactNode } from "react";

interface OverlayProps {
	onClick: any
	children: ReactNode
};

export default function Overlay({ onClick, children }: OverlayProps) {
	return (
		<div
			onClick={onClick}
			className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50"
			style={{ backgroundColor: "rgba(8, 5, 18, 0.6)" }}
		>
			{children}
		</div>
	)
}