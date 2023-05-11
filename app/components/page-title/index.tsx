import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode
}
export default function PageTitle({ children }: PageTitleProps) {
	return (
		<h2 className="
				h2
				mb-6
				border-b border-solid border-black-secondary
			">
			{children}
		</h2>
	)
}