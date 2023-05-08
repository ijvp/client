import type { MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { format, startOfToday, subDays, subWeeks, subMonths, subYears, startOfYear, getMonth, getYear, differenceInDays } from "date-fns";
import { AppProvider, DatePicker } from "@shopify/polaris";

type ClickHandler = (event: MouseEvent<HTMLButtonElement>) => void;

interface IntervalOptionButtonProps {
	selected: boolean,
	onClick: ClickHandler,
	children: ReactNode
};

function IntervalOptionButton({ selected, onClick, children }: IntervalOptionButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`
			px-4 py-2 w-[170px]
			rounded-md border border-solid
			${selected ? "bg-purple border-purple" : "border-black-secondary"}
			`}>
			{children}
		</button>
	)
}

const options = [
	{ label: 'Hoje', value: { start: startOfToday(), end: startOfToday() } },
	{ label: 'Ontem', value: { start: subDays(startOfToday(), 1), end: subDays(startOfToday(), 1) } },
	{ label: 'Últimos 7 dias', value: { start: subWeeks(startOfToday(), 1), end: startOfToday() } },
	{ label: 'Ultimas 14 dias', value: { start: subWeeks(startOfToday(), 2), end: startOfToday() } },
	{ label: 'Últimos 30 dias', value: { start: subMonths(startOfToday(), 1), end: startOfToday() } },
	{ label: 'Último ano', value: { start: subYears(startOfToday(), 1), end: startOfToday() } },
];

interface DateRange {
	start: Date,
	end: Date
};

export default function IntervalSelect() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
		start: startOfToday(),
		end: startOfToday(),
	});
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [{ month, year }, setDate] = useState({ month: getMonth(new Date()), year: getYear(new Date()) });

	const handleOptionSelect = (index: number) => {
		if (index < options.length) {
			setDatePickerOpen(false);
		}
		setSelectedIndex(index);
		setSelectedDateRange(options[index].value);
		// setStart();
		// setEnd();
	};

	const handleSelectedDateChange = (dateRange: DateRange) => {
		setSelectedDateRange(dateRange);
	};

	const handleDateSubmit = () => {
		// setStart();
		// setEnd();
	};

	const handleDatePickerToggle = (event: MouseEvent) => {
		setSelectedIndex(options.length);
		setDatePickerOpen(!datePickerOpen);
	};

	const intervalPredeterminedOptions = options.map((option, index) => {
		let selected = selectedIndex < options.length ? selectedIndex === index : false;

		return (
			<IntervalOptionButton
				key={index}
				selected={selected}
				onClick={() => handleOptionSelect(index)}
			>
				{option.label}
			</IntervalOptionButton>
		)
	});

	return (
		<div className="flex gap-2 my-4">
			{intervalPredeterminedOptions}
			<div className="relative">
				<IntervalOptionButton onClick={handleDatePickerToggle} selected={datePickerOpen}>
					Escolher período
				</IntervalOptionButton>
				{/* {datePickerOpen && (
					<AppProvider>
						<DatePicker
							month={month}
							year={year}
							onChange={handleSelectedDateChange}
							selected={selectedDateRange}
							allowRange
							disableDatesAfter={new Date()}
						/>
					</AppProvider>
				)} */}
			</div>
		</div>
	)
}