import type { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

interface SubmitButtonProps {
	label: string;
	disabled?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void
};

//Esse botão sempre deve ser usado dentro de algum formulário devido ao type="submit".
//O evento deve ser gerenciado pelo seu formulário pai ao inves de passar alguma 
//função "onClick" para esse componente.
export default function SubmitButton({ label, disabled = false, onClick }: SubmitButtonProps) {
	return (
		<button
			type="submit"
			disabled={disabled}
			onClick={onClick}
			className="
				button 
				submit-button
				relative
				flex items-center justify-center
				w-full h-[60px]
				bg-purple 
				rounded-lg 
				px-6 py-4
				hover:bg-dark-purple
				hover:transition-colors
			"
		>
			<span className="bg-purple px-4 z-[2] relative">
				{label}
			</span>
			<div className="
				arrow-icon
				w-12 
				absolute left-1/2 top-1/2 
				-translate-y-1/2 translate-x-[20px]
				z-0
			">
				<img src="/icons/arrow-large.svg" alt="Large arrow" />
			</div>
		</button>
	)
};
