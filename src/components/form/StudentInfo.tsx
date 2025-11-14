import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type FormData, useFormStore } from "@/store/formStore";
import debouncedUpdate from "@/utils/debounce";

import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const Section1Schema = z
  .object({
    group: z.string().min(1),
    name: z.string().trim().min(1),
    dob: z.date(),
    gender: z.string().min(1),
    district: z.string().min(1),
    samithi: z.string().trim().min(1),
    yearOfJoining: z.number().min(2000).max(2025),

    // ADD THIS:
    hasGivenGroup2Exam: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.group === "3") {
      if (!data.hasGivenGroup2Exam || data.hasGivenGroup2Exam.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["hasGivenGroup2Exam"],
          message: "Please indicate whether you have passed the Group 2 exam.",
        });
      }
    }
  });

const districts = [
  "Coimbatore",
  "Dharmapuri / Krishnagiri",
  "Dindigul",
  "Erode",
  "Kanchipuram North",
  "Kanchipuram South",
  "Kanyakumari",
  "Karur",
  "Madurai",
  "Namakkal",
  "Nilgiris",
  "Salem",
  "Sivaganga&Ramnad",
  "Thanjavur",
  "Theni",
  "Trichy",
  "Tirunelveli",
  "Tirupur",
  "Tiruvannamalai",
  "Tuticorin",
  "Vellore",
  "Villupuram",
  "Virudhunagar",
  "Chennai East Coast",
  "Chennai North",
  "Chennai North West",
  "Chennai South",
  "Chennai South East",
  "Chennai West",
  "Cuddalore",
  "Nagapattinam",
  "Puducherry",
  "Tiruvallur East",
  "Tiruvallur West",
  "Mayiladuthurai",
];

// Form starts
export default function StudentInfo() {
  const { formData, updateForm } = useFormStore();

  // Defining it ONCE as a debounced function to update the form
  // But will need to repeat for all components as store is only accessible in functional component

  const checkRequired = (data: FormData) => {
    const parsed = Section1Schema.safeParse(data);

    const isSection1Valid = parsed.success;

    const newArr = [...data.nextSectionEnable];
    newArr[data.sectionNumber] = isSection1Valid;
    if (isSection1Valid) {
      updateForm({ nextSectionEnable: newArr, showErrors: false });
    } else {
      updateForm({ nextSectionEnable: newArr });
    }
  };

  const debouncedFormUpdate = debouncedUpdate((key: string, value: string) => {
    const updated = {
      ...formData,
      [key]: value,
    };

    updateForm({ [key]: value });
    checkRequired(updated);
  });

  // DOB state
  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
    undefined,
  );
  const [dobMonth, setDobMonth] = useState<Date | undefined>(undefined);

  const groupElementsJSX = ["1", "2", "3", "4"].map((group) => {
    return (
      <Button
        key={group}
        onClick={() => {
          const updated = {
            ...formData,
            group,
          };

          // Setting `passed` to null if the group isn't group 3??
          // Or should I keep it as the previous value?
          if (group !== "3") {
            updated.hasGivenGroup2Exam = "";
          }

          if (formData.group != group) {
            if (group == "1") {
              updated.participateInQuizDrawing = "";
              updated.participateInGroupEvent = "";
            } else if (group == "2" || group == "3") {
              updated.devotionalSinging = "";
            } else {
              updated.devotionalSinging = "";
              updated.participateInQuizDrawing = "";
              updated.individualChoice1 = "";
              updated.individualChoice2 = "";
            }

            updated.nextSectionEnable[1] = false;
          }

          updateForm({
            group: group,
            hasGivenGroup2Exam: updated.hasGivenGroup2Exam,
            devotionalSinging: updated.devotionalSinging,
            participateInQuizDrawing: updated.participateInQuizDrawing,
            participateInGroupEvent: updated.participateInGroupEvent,
            individualChoice1: updated.individualChoice1,
            individualChoice2: updated.individualChoice2,
            nextSectionEnable: updated.nextSectionEnable,
          });
          checkRequired(updated); // pass updated state
        }}
        variant="outline"
        // I'm using a simple logic to show which button was selected
        // Using ! for the selected style as shadCN hower continues to be on when i select making it look bad
        // Maybe it won't be an issue in phone, but it sure is in a PC
        className={`flex items-center gap-2 cursor-pointer font-normal 
                ${formData.group === group ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`}
      >
        Group {group}
      </Button>
    );
  });

  const genderElementsJSX = ["Male", "Female"].map((gender) => {
    return (
      <Button
        key={gender}
        onClick={() => {
          const updated = {
            ...formData,
            gender,
          };

          updateForm({ gender: gender });
          checkRequired(updated);
        }}
        variant="outline"
        // size="lg"
        className={`flex items-center gap-2 cursor-pointer font-normal 
                ${formData.gender === gender ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`}
      >
        {gender}
      </Button>
    );
  });

  const districtElementsJSX = districts.map((district) => (
    <SelectItem key={district} value={district}>
      {district}
    </SelectItem>
  ));

  return (
    <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
      {formData.showErrors &&
        !formData.nextSectionEnable[formData.sectionNumber] && (
          <div className="text-red-600 text-sm mb-1">
            Please fill in all the required fields with their correct values.
            You can only proceed to the next section when all required fields
            are filled correctly
          </div>
        )}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Student Information</FieldLegend>
          <FieldDescription>
            Please enter the CORRECT information about the participation
          </FieldDescription>

          {/* Group selection field */}
          <FieldGroup>
            {formData.showErrors &&
              !Section1Schema.shape.group.safeParse(formData.group).success && (
                <div className="text-red-600 text-sm">Group is required</div>
              )}
            <Field>
              <FieldLabel htmlFor="student-group">Select Group *</FieldLabel>

              <div className="flex flex-wrap gap-3">{groupElementsJSX}</div>
            </Field>

            {/* Pop-up for grp 2 pass or not if the selected group is 3 */}
            {formData.group == "3" && (
              <>
                {formData.showErrors && formData.hasGivenGroup2Exam == "" && (
                  <div className="text-red-600 text-sm">
                    Please indicate whether you have passed the Group 2 exam
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="passed-grp2-exam">
                    Passed Group 2 Exam? *
                  </FieldLabel>

                  <RadioGroup
                    value={formData.hasGivenGroup2Exam.toString()}
                    onValueChange={(val) => {
                      console.log(val);
                      const updated = {
                        ...formData,
                        hasGivenGroup2Exam: val,
                      };
                      updateForm({ hasGivenGroup2Exam: val });
                      checkRequired(updated);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="yes" id="yes-passed" />
                      <Label htmlFor="yes-passed">Yes</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="no" id="no-passed" />
                      <Label htmlFor="no-passed">No</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </>
            )}

            {/* Name */}
            {/* MAKE SURE UR defaultValue IS EQUAL TO THE STORE FOR INPUT FIELDS, NOT DIRECTLY `value` AS THAT WILL CAUSE LOT OF LAG */}
            <Field>
              {formData.showErrors &&
                !Section1Schema.shape.name.safeParse(formData.name).success && (
                  <div className="text-red-600 text-sm">Name is required</div>
                )}
              <FieldLabel htmlFor="name">Name *</FieldLabel>
              <Input
                type="text"
                placeholder="Your Name"
                id="name"
                defaultValue={formData.name.toString()}
                onChange={(e) => debouncedFormUpdate("name", e.target.value)}
              />
            </Field>

            {/* DOB */}
            <Field>
              {formData.showErrors &&
                !Section1Schema.shape.dob.safeParse(formData.dob).success && (
                  <div className="text-red-600 text-sm">
                    Date of Birth is required
                  </div>
                )}
              <FieldLabel htmlFor="dob">Date of Birth *</FieldLabel>
              <Popover
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);

                  if (isOpen) {
                    if (formData.dob) {
                      setDobMonth(formData.dob);
                    } else {
                      setDobMonth(undefined);
                    }
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                  >
                    {formData.dob
                      ? formData.dob.toLocaleDateString("en-IN")
                      : "Select date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>

                {/* TODO: Make the pop-over calendart the same length as the button and center it */}
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.dob}
                    month={dobMonth}
                    onMonthChange={setDobMonth}
                    captionLayout="dropdown"
                    disabled={{ after: new Date() }}
                    onSelect={(date) => {
                      const updated = {
                        ...formData,
                        dob: date,
                      };
                      updateForm({ dob: date });
                      checkRequired(updated);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            {/* Gender */}
            <Field>
              {formData.showErrors &&
                !Section1Schema.shape.gender.safeParse(formData.gender)
                  .success && (
                  <div className="text-red-600 text-sm">Gender is required</div>
                )}
              <FieldLabel htmlFor="gender">Gender *</FieldLabel>
              <div className="flex flex-wrap gap-3">{genderElementsJSX}</div>
            </Field>

            {/* District */}
            <Field>
              {formData.showErrors &&
                !Section1Schema.shape.district.safeParse(formData.district)
                  .success && (
                  <div className="text-red-600 text-sm">
                    District is required
                  </div>
                )}
              <FieldLabel htmlFor="district">District *</FieldLabel>
              <Select
                value={formData.district.toString()}
                onValueChange={(val) => updateForm({ district: val })}
              >
                <SelectTrigger className="font-normal">
                  <SelectValue placeholder="Select your district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Districts</SelectLabel>
                    {districtElementsJSX}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {/* Samithi */}
            <Field>
              {formData.showErrors &&
                !Section1Schema.shape.samithi.safeParse(formData.samithi)
                  .success && (
                  <div className="text-red-600 text-sm">
                    Samithi is required
                  </div>
                )}
              <FieldLabel htmlFor="samithi">Samithi *</FieldLabel>
              <Input
                type="text"
                placeholder="Your Samithi"
                id="samithi"
                defaultValue={formData.samithi.toString()}
                onChange={(e) => debouncedFormUpdate("samithi", e.target.value)}
              />
            </Field>

            {/* Couldn't find a year only dropdown in SHADCN, might just make it a select button later? */}
            <Field>
              {formData.showErrors &&
                !Section1Schema.shape.yearOfJoining.safeParse(
                  formData.yearOfJoining,
                ).success && (
                  <div className="text-red-600 text-sm">
                    Year of Joining Balvikas is required
                  </div>
                )}
              <FieldLabel htmlFor="year-bv">
                Student's Year of Joining Balvikas *
              </FieldLabel>
              <Input
                type="number"
                placeholder="2019"
                id="year-bv"
                defaultValue={formData.yearOfJoining}
                min={2000}
                max={2025}
                onChange={(e) => {
                  const year = Number(e.target.value);
                  debouncedFormUpdate("yearOfJoining", year);

                  // If old date invalid → reset it
                  if (
                    formData.dateOfJoining &&
                    formData.dateOfJoining.getFullYear() !== year
                  ) {
                    {
                      formData.dateOfJoining &&
                        toast.info(
                          "Date of Joining Balvikas reset as it was outside the selected year",
                          {
                            action: {
                              label: "OK",
                              onClick: () => {},
                            },
                          },
                        );
                    }
                    updateForm({ dateOfJoining: undefined });
                  }

                  // Auto-scroll ONLY once on year change
                  setCalendarMonth(new Date(year, 0, 1));
                }}
              />
            </Field>

            {/* Date of Joining Balvikas */}
            <Field>
              <FieldLabel htmlFor="date-bv">
                Date of Joining Balvikas (Optional)
              </FieldLabel>
              <Popover
                open={openJoin}
                onOpenChange={(open) => {
                  setOpenJoin(open);

                  if (open) {
                    if (formData.dateOfJoining) {
                      setCalendarMonth(formData.dateOfJoining); // reopen at last date
                    } else if (formData.yearOfJoining) {
                      setCalendarMonth(new Date(formData.yearOfJoining, 0, 1)); // scroll to year
                    }
                    // else leave undefined → default behavior
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                  >
                    {formData.dateOfJoining
                      ? formData.dateOfJoining.toLocaleDateString("en-IN")
                      : "Select date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>

                {/* TODO: Make the pop-over calendart the same length as the button and center it */}
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.dateOfJoining}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      updateForm({ dateOfJoining: date });
                      setOpenJoin(false);
                    }}
                    disabled={
                      formData.yearOfJoining
                        ? {
                            before: new Date(formData.yearOfJoining, 0, 1),
                            after: new Date(formData.yearOfJoining, 11, 31),
                          }
                        : undefined
                    }
                  />
                </PopoverContent>
              </Popover>
            </Field>

            {/* Food Allergies */}
            <Field>
              <FieldLabel htmlFor="allergy">
                Food Allergies (Optional)
              </FieldLabel>
              <Input
                type="text"
                placeholder="Peanuts, Gluten..."
                defaultValue={formData.foodAllergies.toString()}
                onChange={(e) =>
                  debouncedFormUpdate("foodAllergies", e.target.value)
                }
                id="allergy"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
      <Toaster />
    </div>
  );
}
