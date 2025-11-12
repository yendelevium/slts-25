import { Store } from "@tanstack/store"

export interface FormData {
  // Student Info
  group: string
  hasGivenGroup2Exam: string
  name: string
  dob: Date | undefined
  gender: string
  district: string
  samithi: string
  yearOfJoining: string
  dateOfJoining: Date | undefined
  foodAllergies: string

  // Contestant Info
  devotionalSinging: string
  individualChoice1: string
  individualChoice2: string
  passedGroup2Exam: string
  rulesAcknowledged: boolean
  participateInQuiz: string
  participateInGroupEvent: string

  // Logistics
  arrivalDateTime: Date | undefined
  needPickup: string
  pickupMode: string
  pickupPoint: string
  departureDateTime: Date | undefined
  needDrop: string
  dropMode: string
  dropPoint: string

  // Accompanying
  adultsAccompanying: string
  numMaleMembers: number
  numFemaleMembers: number
  maleNames: string[]
  femaleNames: string[]
  pocName: string
  pocGender: string
  pocRelation: string
  pocPhone: string
  pocAge: string

  // Accommodation
  needAccommodation: string
  accomMaleMembers: number
  accomFemaleMembers: number
  checkInDateTime: Date | undefined
  checkOutDateTime: Date | undefined
}

const initialFormData: FormData = {
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
  participateInQuiz: "",
  participateInGroupEvent: "",

  arrivalDateTime: undefined,
  needPickup: "",
  pickupMode: "",
  pickupPoint: "",
  departureDateTime: undefined,
  needDrop: "",
  dropMode: "",
  dropPoint: "",

  adultsAccompanying: "",
  numMaleMembers: 0,
  numFemaleMembers: 0,
  maleNames: [],
  femaleNames: [],
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
}

// Tanstack Store to manage form state -> single source of truth
const formStore = new Store<FormData>(initialFormData)

export { formStore }
