import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode
};

export default function PageTitle({ children }: PageTitleProps) {
	return (
		<h2 className="
				relative
				h2 tracking-tightest 
				md:tracking-normal
				mb-6 pb-6
				border-b border-solid border-black-secondary
			">
			{children}
		</h2>
	);
};