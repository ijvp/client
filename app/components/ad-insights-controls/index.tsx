const AdInsightsControls = ({ columnOptions, selectedColumns, setSelectedColumns }) => {
	const handleCheckboxChange = (optionValue) => {
		setSelectedColumns((prevSelectedColumns) =>
			prevSelectedColumns.includes(optionValue)
				? prevSelectedColumns.filter((column) => column !== optionValue)
				: [...prevSelectedColumns, optionValue]
		);
	};

	return (
		<fieldset className="flex flex-col gap-4">
			<legend className="relative">
				<p className="text-xl text-[#FFF]">Filtrar colunas</p>
			</legend>
			<div className="flex flex-wrap gap-2 mt-4">
				{columnOptions.map((option: any, index: number) => option.value !== "name" && (
					<div
						key={index}
						className={`
						flex
						gap-2 
						relative 
						rounded-md 
						px-6 py-2
						cursor-pointer
						border border-black-secondary 
						${selectedColumns.includes(
							option.value
						) ? 'bg-purple' : ''}`}
						onClick={() => handleCheckboxChange(option.value)}
					>
						<input
							type="checkbox"
							id={option.value}
							className="hidden"
							checked={selectedColumns.includes(option.value)}
							onChange={() => handleCheckboxChange(option.value)}
						/>
						<label
							className="cursor-pointer"
							htmlFor={option.value}
						>{option.label}</label>
						{selectedColumns.includes(
							option.value
						) && <img src="/icons/x.svg" alt="close" />}
					</div>
				))}
			</div>
		</fieldset>
	);
};

export default AdInsightsControls;
