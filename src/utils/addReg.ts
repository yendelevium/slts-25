import { addDoc, collection } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormData } from "@/store/formStore";
import { db } from "./firebase";
import { fetchEventsMap } from "./checkSameEvent";

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

  // Registration validity
  validity: boolean;
  conflictingEvents: string[];
}

export function useAddRegistration() {
  const queryClient = useQueryClient();
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

      // Add gender suffix for individual events (except elocutions & quiz/drawing)
      const addGenderSuffix = (
        event: string,
        gender: string,
        group: string,
      ) => {
        if ((group == "1" && event != "devotional-singing") || group == "4")
          return event; // No suffix for group 1
        if (!event) return event;

        // Skip exceptions
        if (event.includes("elocution")) return event;
        if (event === "quiz" || event === "drawing") return event;

        const suffix = gender === "Male" ? " - Boys" : " - Girls";
        return `${event}${suffix}`;
      };

      // Apply to two individual choices
      individualChoice1 = addGenderSuffix(
        individualChoice1.toString(),
        data.gender.toString(),
        data.group.toString(),
      );
      individualChoice2 = addGenderSuffix(
        individualChoice2.toString(),
        data.gender.toString(),
        data.group.toString(),
      );
      groupEvent = addGenderSuffix(
        groupEvent.toString(),
        data.gender.toString(),
        data.group.toString(),
      );

      const eventMap = await queryClient.fetchQuery({
        queryKey: ["eventMap", data.district, data.group],
        queryFn: () =>
          fetchEventsMap(data.district.toString(), data.group.toString()),
      });

      // 2nd line of defense: if group 3 and hasn't given group 2 exam, clear individual choices
      if (data.group.toString() === "3" && data.hasGivenGroup2Exam === "no") {
        individualChoice1 = "";
        individualChoice2 = "";
      }

      // Check for conflicts
      let validity = true;
      let conflictingEvents: string[] = [];
      if (eventMap[individualChoice1.toString()]) {
        validity = false;
        conflictingEvents.push(individualChoice1.toString());
      }
      if (individualChoice2 !== "" && eventMap[individualChoice2.toString()]) {
        validity = false;
        conflictingEvents.push(individualChoice2.toString());
      }
      if (groupEvent !== "") {
        const ev = groupEvent.toString();
        const count = eventMap[ev] || 0;

        if (
          (ev.includes("devotional-singing") && count >= 5) ||
          (ev.includes("altar-decoration") && count >= 4) ||
          (ev.includes("rudram-namakam-chanting") && count >= 4)
        ) {
          validity = false;
          conflictingEvents.push(ev);
        }
      }

      console.log(validity, conflictingEvents);

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
        // Validating here for better UX (in case the user accidentally clicks no after filling details)
        adultsAccompanying: data.adultsAccompanying,
        numMaleMembers:
          data.adultsAccompanying === "yes" ? data.numMaleMembers : 0,
        numFemaleMembers:
          data.adultsAccompanying === "yes" ? data.numFemaleMembers : 0,
        pocName: data.adultsAccompanying === "yes" ? data.pocName : "",
        pocGender: data.adultsAccompanying === "yes" ? data.pocGender : "",
        pocRelation: data.adultsAccompanying === "yes" ? data.pocRelation : "",
        pocPhone: data.adultsAccompanying === "yes" ? data.pocPhone : "",
        pocAge: data.adultsAccompanying === "yes" ? data.pocAge : "",

        // Accommodation
        needAccommodation: data.needAccommodation,
        accomMaleMembers:
          data.needAccommodation === "yes" ? data.accomMaleMembers : 0,
        accomFemaleMembers:
          data.needAccommodation === "yes" ? data.accomFemaleMembers : 0,
        maleDetails: data.needAccommodation === "yes" ? data.maleDetails : [],
        femaleDetails:
          data.needAccommodation === "yes" ? data.femaleDetails : [],
        checkInDate:
          data.needAccommodation === "yes" && data.checkInDate !== undefined
            ? data.checkInDate
            : null,
        checkInTime: data.needAccommodation === "yes" ? data.checkInTime : "",
        checkOutDate:
          data.needAccommodation === "yes" && data.checkOutDate !== undefined
            ? data.checkOutDate
            : null,
        checkOutTime: data.needAccommodation === "yes" ? data.checkOutTime : "",

        // Registration validity
        validity,
        conflictingEvents,
      };

      const docRef = await addDoc(collection(db, "register"), insertData);
      console.log("Document written with ID: ", docRef.id);

      // SEND MAIL TO HEAD WITH THE FORM DETAILS AND VALIDITY (along with the inserted data ka id)?
      return docRef;
    },
  });
}
