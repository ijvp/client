import { atom } from "jotai";
import type { Store } from "~/types";
import { startOfToday } from "date-fns";

const storesAtom = atom<Store[]>([]);
const storeIndexAtom = atom<number>(0);
const startDateAtom = atom<Date>(startOfToday());
const endDateAtom = atom<Date>(startOfToday());

export { storesAtom, storeIndexAtom, startDateAtom, endDateAtom };