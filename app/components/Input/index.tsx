import type { ChangeEvent } from "react";

type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

interface InputProps {
	type: string;
	name: string;
	placeholder: string;
	value?: string;
	autocomplete?: string;
	onChange?: ChangeHandler,
	// debounceDelay?: number;
};

export default function Input({ type, name, placeholder, value, autocomplete, onChange }: InputProps) {
	// const debouncedOnChange = debounce(onChange, debounceDelay);

	// const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	debouncedOnChange(event);
	// };

	return (
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			value={value}
			autoComplete={autocomplete}
			onChange={onChange}
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