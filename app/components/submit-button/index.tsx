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
			<span className="bg-purple z-[2] relative">
				{label}
			</span>
			<div className="
				arrow-icon
			">
				<div></div>
			</div>
		</button>
	)
};
