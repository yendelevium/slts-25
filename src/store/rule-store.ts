import { create } from "zustand";

type Index = Record<string, { idx: number; flag: boolean }>;

const idx: Index = {
	Vegan: { idx: 0, flag: false },
	"Dairy Allergy": { idx: 1, flag: false },
	"Seafood Allergy": { idx: 2, flag: false },
	"Keto Diet": { idx: 3, flag: false },
};

const getFlagByIdx = (idxValue: number, idxObj: Index): boolean => {
	const key = Object.keys(idxObj).find((key) => idxObj[key].idx === idxValue);
	if (key === undefined) return false;
	return idxObj[key].flag;
};

const n = Object.keys(idx).length;

type RuleStoreState = {
	idx: Index;
	matrix: boolean[][];
	checkStatus: (rule: string) => boolean;
	setFlag: (rule: string, flat: boolean) => void;
	getFlag: (rule: string) => boolean;
};

const generateMatrix = (): boolean[][] => {
	return Array.from({ length: n }, () => new Array(n).fill(true));
};

// Dummy data
const dummyMatrix: boolean[][] = [
	// vegan | dairy | sea | keto
	[true, true, true, false], // began
	[true, true, true, true], // dairy
	[true, true, true, true], // seafood
	[false, true, true, true], // keto
];

export const useRuleStore = create<RuleStoreState>((set, get) => {
	return {
		// Rules and data
		idx: idx,
		matrix: dummyMatrix,

		checkStatus: (rule: string): boolean => {
			const ruleIdx = get().idx[rule].idx;
			const row = get().matrix[ruleIdx];

			for (let i = 0; i < n; i++) {
				if (!row[i]) {
					if (getFlagByIdx(i, get().idx)) {
						return false; // disable the input
					}
				}
			}
			return true;
		},

		setFlag: (rule: string, flag: boolean) => {
			const currentIdx = get().idx;

			const updatedIdx = {
				...currentIdx,
				[rule]: {
					...currentIdx[rule],
					flag,
				},
			};
			set({ idx: updatedIdx });
		},

		getFlag: (rule: string): boolean => {
			return idx[rule].flag;
		},
	};
});

