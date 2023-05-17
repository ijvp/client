import type { MouseEvent, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useCallback, useState } from "react";
import { endOfToday, startOfToday, subDays, subWeeks, subMonths, subYears, getMonth, getYear, startOfDay, } from "date-fns";
import { DatePicker } from "@shopify/polaris";
import { formatDate, formatDateLabel, parseDateString } from "~/utils/date";
import { Link, useSearchParams } from "@remix-run/react";
import styles from "./styles.css";
import { endOfDay } from "date-fns";

type ClickHandler = (event: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;

interface IntervalOptionButtonProps {
	selected: boolean,
	children: ReactNode,
	onClick?: ClickHandler,
	start?: Date,
	end?: Date
};

function IntervalOptionButton({ selected, children, onClick, start, end }: IntervalOptionButtonProps) {
	const [searchParams] = useSearchParams();

	// Convert searchParams to an object
	const searchParamsObj = Object.fromEntries(searchParams);

	// Add start and end parameters to the object
	if (start && end) {
		searchParamsObj.start = formatDate(start);
		searchParamsObj.end = formatDate(end);

		return (
			<Link to={{ search: new URLSearchParams(searchParamsObj).toString() }}>
				<div
					onClick={onClick}
					className={`
					px-4 py-2 min-w-[170px] w-fit
					rounded-md border border-solid
					text-white text-center
					${selected ? "bg-purple border-purple" : "border-black-secondary"}
				`}>
					{children}
				</div>
			</Link>
		)
	} else {
		return (
			<div
				onClick={onClick}
				className={`
					px-4 py-2 min-w-[170px] w-fit
					rounded-md border border-solid
					text-white text-center
					${selected ? "bg-purple border-purple" : "border-black-secondary"}
				`}>
				{children}
			</div>
		)
	}
};

const options = [
	{ label: 'Hoje', value: { start: startOfToday(), end: endOfToday() } },
	{ label: 'Ontem', value: { start: subDays(startOfToday(), 1), end: subDays(endOfToday(), 1) } },
	{ label: 'Últimos 7 dias', value: { start: subWeeks(startOfToday(), 1), end: endOfToday() } },
	{ label: 'Ultimos 14 dias', value: { start: subWeeks(startOfToday(), 2), end: endOfToday() } },
	{ label: 'Últimos 30 dias', value: { start: subMonths(startOfToday(), 1), end: endOfToday() } },
	{ label: 'Último ano', value: { start: subYears(startOfToday(), 1), end: endOfToday() } },
];

interface DateRange {
	start: Date,
	end: Date
};

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles }
];

export default function IntervalSelect() {
	const [searchParams] = useSearchParams();
	const start = searchParams.get("start");
	const end = searchParams.get("end");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
		start: start ? parseDateString(start) : startOfToday(),
		end: end ? parseDateString(end) : startOfToday(),
	});
	const [{ month, year }, setDate] = useState({ month: getMonth(new Date()), year: getYear(new Date()) });
	const [datePickerOpen, setDatePickerOpen] = useState(false);

	const handleMonthChange = useCallback(
		(month: number, year: number) => setDate({ month, year }),
		[]
	);

	const handleOptionSelect = (index: number) => {
		setSelectedIndex(index);
		setDatePickerOpen(false);
	};

	const handleDateRangeChange = (dateRange: DateRange) => {
		setSelectedDateRange(dateRange);
	};

	const handleDateRangeSubmit = () => {
		const queryParams = new URLSearchParams(searchParams);
		queryParams.set("start", formatDate(selectedDateRange.start));
		queryParams.set("end", formatDate(selectedDateRange.end));
		window.location = `${location.pathname}?${queryParams.toString()}`;
		setDatePickerOpen(false);
	};

	const handleDatePickerToggle = (event: MouseEvent) => {
		event.stopPropagation();
		setSelectedIndex(options.length);
		setDatePickerOpen(!datePickerOpen);
	};

	useEffect(() => {
		if (start && end) {
			const index = options.findIndex(option =>
				option.value.start.toLocaleString() === startOfDay(parseDateString(start)).toLocaleString() &&
				option.value.end.toLocaleString() === endOfDay(parseDateString(end)).toLocaleString());
			index > -1 ? setSelectedIndex(index) : setSelectedIndex(options.length);
		} else {
			setSelectedIndex(0);
		}
	}, [start, end]);

	const dateRangeLabel =
		selectedIndex === options.length ?
			(
				formatDateLabel(selectedDateRange.start) + " - " + formatDateLabel(selectedDateRange.end)
			) : (
				"Escolher período"
			);

	const intervalPredeterminedOptions = useMemo(
		() =>
			options.map((option, index) => (
				<IntervalOptionButton
					key={index}
					onClick={() => handleOptionSelect(index)}
					selected={selectedIndex < options.length ? index === selectedIndex : false}
					start={option.value.start}
					end={option.value.end}
				>
					{option.label}
				</IntervalOptionButton>
			)),
		[selectedIndex]
	);

	return (
		<div className="flex gap-4 my-6 interval-options">
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