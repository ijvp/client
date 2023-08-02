import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode
};

export default function PageTitle({ children }: PageTitleProps) {
	return (
		<h2 className="
				relative
				text-4xl tracking-tightest 
				md:text-5xl md:tracking-normal
				mb-6 pb-6
				border-b border-solid border-black-secondary
			">
			{children}
		</h2>
	);
};