import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  participateInQuizDrawing: string
  participateInGroupEvent: string

  // Logistics
  arrivalDate: Date | undefined
  arrivalTime: string
  needPickup: string
  arrivalMode: string
  pickupPoint: string
  departureDate: Date | undefined
  departureTime: string
  needDrop: string
  departureMode: string
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

// Switch to zustand store
interface FormStore {
  formData: FormData
  updateForm: (partial: Partial<FormData>) => void
  resetForm: () => void
}

const useFormStore = create<FormStore>()(
  // To make the store persistent across reloads, we store it in session-storage
  // This way, refreshing the page won't lose the data filled so far, but closing the tab will(coz session-storage)
  persist(
    (set) => ({
      formData: initialFormData,
      updateForm: (partial) =>
        set((state) => ({
          formData: { ...state.formData, ...partial },
        })),
      resetForm: () => set({ formData: initialFormData }),
    }),
    {
      name: "form-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          if (!value) return null

          const parsed = JSON.parse(value)

          // When storing in local session, Date objects are converted to strings
          // Convert back strings to Date objects
          const dates = [
            "dob",
            "dateOfJoining",
            "arrivalDate",
            "departureDate",
            "checkInDateTime",
            "checkOutDateTime",
          ]

          // Same fr numbers also
          const numbers = [
            "numMaleMembers",
            "numFemaleMembers",
            "accomMaleMembers",
            "accomFemaleMembers",
          ]

          const data = parsed.state?.formData
          if (data) {
            for (const key of dates) {
              if (data[key]) data[key] = new Date(data[key])
            }
            for (const key of numbers) {
              if (data[key]) data[key] = Number(data[key])
            }
          }
          
          return parsed
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
)
export { useFormStore }