import { atom } from "jotai";
import type { Store } from "~/ts/types";
import { startOfToday } from "date-fns";

const storesAtom = atom<Store[]>([]);
const storeIndexAtom = atom<number>(0);
const startDateAtom = atom<Date>(startOfToday());
const endDateAtom = atom<Date>(startOfToday());
const userAtom = atom<String>("");

export { storesAtom, storeIndexAtom, startDateAtom, endDateAtom, userAtom };