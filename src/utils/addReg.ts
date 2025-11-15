import { addDoc, collection } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { type FormData } from "@/store/formStore";
import { db } from "./firebase";

interface RegisterData {
  // Student Info
  group: String;
  hasGivenGroup2Exam: String;
  name: String;
  dob: Date | null;
  gender: String;
  district: String;
  samithi: String;
  yearOfJoining: number;
  dateOfJoining: Date | null;
  foodAllergies: String;

  // Contestant Info
  groupEvent: String;
  individualChoice1: String;
  individualChoice2: String;
  passedGroup2Exam: String;

  // Logistics
  arrivalDate: Date | null;
  arrivalTime: String;
  needPickup: String;
  arrivalMode: String;
  pickupPoint: String;
  departureDate: Date | null;
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
  checkInDate: Date | null;
  checkInTime: String;
  checkOutDate: Date | null;
  checkOutTime: String;
}

export function useAddRegistration() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      let groupEvent: String = "";
      if (data.devotionalSinging === "yes") {
        groupEvent = "devotional-singing";
      } else if (
        data.participateInGroupEvent !== "none" &&
        data.participateInGroupEvent !== ""
      ) {
        groupEvent = data.participateInGroupEvent;
      }

      let individualChoice1 = data.individualChoice1;
      let individualChoice2 = data.individualChoice2;

      const quizChoice = data.participateInQuizDrawing;

      // If quiz/drawing picked
      if (quizChoice === "quiz" || quizChoice === "drawing") {
        if (individualChoice1 !== "") {
          individualChoice2 = individualChoice1;
        }
        individualChoice1 = quizChoice;
      }

      const insertData: RegisterData = {
        // Student Info
        group: data.group,
        hasGivenGroup2Exam: data.hasGivenGroup2Exam,
        name: data.name,
        dob: data.dob === undefined ? null : data.dob,
        gender: data.gender,
        district: data.district,
        samithi: data.samithi,
        yearOfJoining: data.yearOfJoining,
        dateOfJoining:
          data.dateOfJoining === undefined ? null : data.dateOfJoining,
        foodAllergies: data.foodAllergies,

        // Contestant Info
        groupEvent,
        individualChoice1,
        individualChoice2,
        passedGroup2Exam: data.passedGroup2Exam,

        // Logistics
        arrivalDate: data.arrivalDate === undefined ? null : data.arrivalDate,
        arrivalTime: data.arrivalTime,
        needPickup: data.needPickup,
        arrivalMode: data.arrivalMode,
        pickupPoint: data.pickupPoint,
        departureDate:
          data.departureDate === undefined ? null : data.departureDate,
        departureTime: data.departureTime,
        needDrop: data.needDrop,
        departureMode: data.departureMode,
        dropPoint: data.dropPoint,

        // Accompanying
        adultsAccompanying: data.adultsAccompanying,
        numMaleMembers: data.numMaleMembers,
        numFemaleMembers: data.numFemaleMembers,
        pocName: data.pocName,
        pocGender: data.pocGender,
        pocRelation: data.pocRelation,
        pocPhone: data.pocPhone,
        pocAge: data.pocAge,

        // Accommodation
        needAccommodation: data.needAccommodation,
        accomMaleMembers: data.accomMaleMembers,
        accomFemaleMembers: data.accomFemaleMembers,
        maleDetails: data.maleDetails,
        femaleDetails: data.femaleDetails,
        checkInDate: data.checkInDate === undefined ? null : data.checkInDate,
        checkInTime: data.checkInTime,
        checkOutDate:
          data.checkOutDate === undefined ? null : data.checkOutDate,
        checkOutTime: data.checkOutTime,
      };
      const docRef = await addDoc(collection(db, "register"), insertData);
      console.log("Document written with ID: ", docRef.id);
      return docRef;
    },
  });
}
