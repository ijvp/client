import { useCallback, useMemo, useState } from "react";
import { Combobox, HorizontalStack, Icon, LegacyStack, Listbox, Tag } from "@shopify/polaris";
import { SearchMinor } from '@shopify/polaris-icons';
import { Headers } from "~/ts/enums";

const AdInsightsControls = ({ columnOptions, selectedColumns, setSelectedColumns }) => {
	const [inputValue, setInputValue] = useState("");
	const options = useMemo(() => {
		if (inputValue === "") return columnOptions;
		const filterRegex = new RegExp(inputValue, 'i');
		return columnOptions.filter(option => option.label.match(filterRegex));
	}, [columnOptions, inputValue]);

	const updateText = useCallback((value) => {
		setInputValue(value);
	}, []);

	const updateSelection = useCallback((selected) => {
		setSelectedColumns(prevSelectedColumns => {
			if (prevSelectedColumns.includes(selected)) {
				return prevSelectedColumns.filter(column => column !== selected);
			} else {
				return [...prevSelectedColumns, selected];
			}
		});
		setInputValue("");
	}, [setSelectedColumns]);

	const removeTag = useCallback((tag) => () => {
		setSelectedColumns(prevSelectedColumns => prevSelectedColumns.filter(column => column !== tag));
	}, [setSelectedColumns]);

	const tagsMarkup = useMemo(() => {
		return selectedColumns.map((column, index) => {
			return column !== "name" && (
				<Tag key={index} onRemove={removeTag(column)}>
					{Headers[column]}
				</Tag>
			);
		});
	}, [selectedColumns, removeTag]);

	const columnsMarkup = useMemo(() => {
		if (options.length === 0) return null;
		return options.map((option, index) => {
			const { label, value } = option;
			return label !== 'Nome' && (
				<Listbox.Option
					key={index}
					value={value}
					selected={selectedColumns.includes(value)}
					accessibilityLabel={label}
				>
					{label}
				</Listbox.Option>
			);
		});
	}, [options, selectedColumns]);

	return (
		<div className="flex flex-col gap-2 my-8">
			<Combobox
				allowMultiple
				activator={
					<Combobox.TextField
						id="ad-insights-controls-text-field-label"
						prefix={<Icon source={SearchMinor} />}
						onChange={updateText}
						label="Selecionar colunas"
						labelHidden
						value={inputValue}
						placeholder="Selecionar colunas"
						autoComplete="off"
					/>
				}>
				{columnsMarkup ? (
					<Listbox onSelect={updateSelection}>{columnsMarkup}</Listbox>
				) : null}
			</Combobox>
			<HorizontalStack gap="4">
				<LegacyStack>{tagsMarkup}</LegacyStack>
			</HorizontalStack>
		</div>
	);
};

export default AdInsightsControls;
