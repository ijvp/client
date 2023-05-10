import type { MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { format, startOfToday, subDays, subWeeks, subMonths, subYears, startOfYear, getMonth, getYear, differenceInDays } from "date-fns";
import { DatePicker } from "@shopify/polaris";

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
			px-4 py-2 min-w-[170px] w-fit
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
	{ label: 'Ultimos 14 dias', value: { start: subWeeks(startOfToday(), 2), end: startOfToday() } },
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

	const handleMonthChange = useCallback(
		(month: number, year: number) => setDate({ month, year }),
		[]
	);

	const handleDateRangeChange = (dateRange: DateRange) => {
		setSelectedDateRange(dateRange);
	};

	const handleDateRangeSubmit = () => {
		// setStart(selectedDateRange.start);
		// setEnd(selectedDateRange.end);
		setDatePickerOpen(false);
	};

	const handleDatePickerToggle = (event: MouseEvent) => {
		setSelectedIndex(options.length);
		setDatePickerOpen(!datePickerOpen);
	};

	const formatDate = (date: Date) => {
		const year = String(date.getFullYear());
		let month = String(date.getMonth() + 1);
		let day = String(date.getDate());
		if (month.length < 2) {
			month = String(month).padStart(2, "0");
		}

		if (day.length < 2) {
			day = String(day).padStart(2, "0");
		}

		return [day, month, year].join("/");
	};

	const dateRangeLabel =
		selectedIndex === options.length ?
			(
				formatDate(selectedDateRange.start) + " - " + formatDate(selectedDateRange.end)
			) : (
				"Escolher período"
			);

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
				<IntervalOptionButton onClick={handleDatePickerToggle} selected={selectedIndex === options.length}>
					{dateRangeLabel}
				</IntervalOptionButton>
				{datePickerOpen && (
					<div
						className="
						absolute top-12 left-1/2 -translate-x-1/2
						flex flex-col items-center gap-2
						bg-black-bg
						border border-solid border-black-border rounded-md
						p-2
						w-full min-w-fit
						">
						<DatePicker
							month={month}
							year={year}
							onChange={handleDateRangeChange}
							onMonthChange={handleMonthChange}
							selected={selectedDateRange}
							allowRange
							disableDatesAfter={new Date()}
						/>
						<button
							onClick={handleDateRangeSubmit}
							className="
							button
							w-full
							mb-2 py-2
							bg-purple 
							rounded-md
						">
							Aplicar
						</button>
					</div>
				)}
			</div>
		</div>
	)
}