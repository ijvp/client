import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode
};

export default function PageTitle({ children }: PageTitleProps) {
	return (
		<h2 className="
				flex
				justify-between
				gap-8
				items-end
				relative
				text-2xl font-semibold tracking-tightest 
				md:text-5xl md:tracking-normal
				mb-6 pb-4 md:pb-6
				border-b border-solid border-black-secondary
			">
			{children}
		</h2>
	);
};