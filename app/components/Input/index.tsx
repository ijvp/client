interface InputProps {
	type: string;
	placeholder: string;
	value?: string;
	autocomplete?: string;
};

export default function Input({ type, placeholder, value, autocomplete }: InputProps) {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			autoComplete={autocomplete}
			className="
			w-full h-[60px]
			bg-black-secondary 
			rounded-lg 
			px-6 py-4
			box-border
			focus:border focus:border-solid focus:border-purple
			focus-visible:outline-none
		"/>
	);
}