import { atom } from "jotai";
import { startOfToday } from "date-fns";

const storesAtom = atom<[]>([]);
const storeIndexAtom = atom<number>(0);
const startDateAtom = atom<Date>(startOfToday());
const endDateAtom = atom<Date>(startOfToday());
const userAtom = atom<String>("");
const connectionsAtom = atom<[]>([]);

export {
	storesAtom,
	storeIndexAtom,
	startDateAtom,
	endDateAtom,
	userAtom,
	connectionsAtom
};