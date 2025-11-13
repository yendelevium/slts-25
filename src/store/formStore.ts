import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FormData {
	// Nav
	sectionNumber: number;
	nextSectionEnable: boolean[];

	// Student Info
	group: String;
	hasGivenGroup2Exam: String;
	name: String;
	dob: Date | undefined;
	gender: String;
	district: String;
	samithi: String;
	yearOfJoining: String;
	dateOfJoining: Date | undefined;
	foodAllergies: String;

	// Contestant Info
	devotionalSinging: String;
	individualChoice1: String;
	individualChoice2: String;
	passedGroup2Exam: String;
	rulesAcknowledged: boolean;
	participateInQuizDrawing: String;
	participateInGroupEvent: String;

	// Logistics
	arrivalDate: Date | undefined;
	arrivalTime: String;
	needPickup: String;
	arrivalMode: String;
	pickupPoint: String;
	departureDate: Date | undefined;
	departureTime: String;
	needDrop: String;
	departureMode: String;
	dropPoint: String;

	// Accompanying
	adultsAccompanying: String;
	numMaleMembers: number;
	numFemaleMembers: number;
	pocName: String;
	pocGender: String;
	pocRelation: String;
	pocPhone: String;
	pocAge: String;

	// Accommodation
	needAccommodation: String;
	accomMaleMembers: number;
	accomFemaleMembers: number;
	maleDetails: { name: String; phone: String }[];
	femaleDetails: { name: String; phone: String }[];
	checkInDateTime: Date | undefined;
	checkOutDateTime: Date | undefined;
}

// Switch to zustand store
interface FormStore {
	formData: FormData;
	updateForm: (partial: Partial<FormData>) => void;
	resetForm: () => void;
}

const useFormStore = create<FormStore>()(
	// To make the store persistent across reloads, we store it in session-storage
	// This way, refreshing the page won't lose the data filled so far, but closing the tab will(coz session-storage)
	persist(
		(set) => ({
			formData: {
				sectionNumber: 0,
				nextSectionEnable: [false, false, false, false, false],
				group: "",
				hasGivenGroup2Exam: "",
				name: "",
				dob: undefined,
				gender: "",
				district: "",
				samithi: "",
				yearOfJoining: "",
				dateOfJoining: undefined,
				foodAllergies: "",

				devotionalSinging: "",
				individualChoice1: "",
				individualChoice2: "",
				passedGroup2Exam: "",
				rulesAcknowledged: false,
				participateInQuizDrawing: "",
				participateInGroupEvent: "",

				arrivalDate: undefined,
				arrivalTime: "",
				needPickup: "",
				arrivalMode: "",
				pickupPoint: "",
				departureDate: undefined,
				departureTime: "",
				needDrop: "",
				departureMode: "",
				dropPoint: "",

				adultsAccompanying: "",
				numMaleMembers: 0,
				numFemaleMembers: 0,
				maleDetails: [],
				femaleDetails: [],
				pocName: "",
				pocGender: "",
				pocRelation: "",
				pocPhone: "",
				pocAge: "",

				needAccommodation: "",
				accomMaleMembers: 0,
				accomFemaleMembers: 0,
				checkInDateTime: undefined,
				checkOutDateTime: undefined,
			},

			updateForm: (partial) =>
				set((state) => ({
					formData: { ...state.formData, ...partial },
				})),

			resetForm: () =>
				set({
			formData: {
				sectionNumber: 0,
				nextSectionEnable: [false, false, false, false, false],
				group: "",
				hasGivenGroup2Exam: "",
				name: "",
				dob: undefined,
				gender: "",
				district: "",
				samithi: "",
				yearOfJoining: "",
				dateOfJoining: undefined,
				foodAllergies: "",

				devotionalSinging: "",
				individualChoice1: "",
				individualChoice2: "",
				passedGroup2Exam: "",
				rulesAcknowledged: false,
				participateInQuizDrawing: "",
				participateInGroupEvent: "",

				arrivalDate: undefined,
				arrivalTime: "",
				needPickup: "",
				arrivalMode: "",
				pickupPoint: "",
				departureDate: undefined,
				departureTime: "",
				needDrop: "",
				departureMode: "",
				dropPoint: "",

				adultsAccompanying: "",
				numMaleMembers: 0,
				numFemaleMembers: 0,
				maleDetails: [],
				femaleDetails: [],
				pocName: "",
				pocGender: "",
				pocRelation: "",
				pocPhone: "",
				pocAge: "",

				needAccommodation: "",
				accomMaleMembers: 0,
				accomFemaleMembers: 0,
				checkInDateTime: undefined,
				checkOutDateTime: undefined,
			},
				}),
		}),
		{
			name: "form-storage",
			storage: {
				getItem: (name) => {
					const value = sessionStorage.getItem(name);
					if (!value) return null;

					const parsed = JSON.parse(value);

					// When storing in local session, Date objects are converted to strings
					// Convert back strings to Date objects
					const dates = [
						"dob",
						"dateOfJoining",
						"arrivalDate",
						"departureDate",
						"checkInDateTime",
						"checkOutDateTime",
					];

					// Same fr numbers also
					const numbers = [
						"numMaleMembers",
						"numFemaleMembers",
						"accomMaleMembers",
						"accomFemaleMembers",
					];

					const data = parsed.state?.formData;
					if (data) {
						for (const key of dates) {
							if (data[key]) data[key] = new Date(data[key]);
						}
						for (const key of numbers) {
							if (data[key]) data[key] = Number(data[key]);
						}
					}

					return parsed;
				},
				setItem: (name, value) => {
					sessionStorage.setItem(name, JSON.stringify(value));
				},
				removeItem: (name) => sessionStorage.removeItem(name),
			},
		},
	),
);
export { useFormStore };
