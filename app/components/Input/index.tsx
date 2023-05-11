import type { ChangeEvent } from "react";

type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

interface InputProps {
	type: string;
	name: string;
	placeholder?: string;
	defaultValue?: string;
	value?: string;
	autocomplete?: string;
	onChange?: ChangeHandler,
	disabled?: boolean,
	icon?: string,
	ariaInvalid?: boolean,
	ariaErrorMessage?: string
	// debounceDelay?: number;
};

export default function Input({
	type,
	name,
	placeholder,
	defaultValue,
	value,
	autocomplete,
	onChange,
	disabled = false,
	icon,
	ariaInvalid,
	ariaErrorMessage
}: InputProps) {
	// const debouncedOnChange = debounce(onChange, debounceDelay);

	// const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	debouncedOnChange(event);
	// };

	return (
		<div className="relative w-full">
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				defaultValue={defaultValue}
				value={value}
				autoComplete={autocomplete}
				onChange={onChange}
				disabled={disabled}
				aria-invalid={ariaInvalid}
				aria-errormessage={ariaErrorMessage}
				className="
				w-full h-[60px]
				bg-black-secondary 
				rounded-lg 
				px-6 py-4
				box-border
				focus:border focus:border-solid focus:border-purple
				focus-visible:outline-none
			"/>
			{icon && (
				<img
					src={`/icons/${icon}`}
					alt={`${icon} alt`}
					className="
					absolute
					right-5
					top-1/2
					-translate-y-1/2
				" />
			)}
		</div>

	);
}