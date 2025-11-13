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
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { type FormData, useFormStore } from "@/store/formStore";
import debouncedUpdate from "@/utils/debounce";
import { z } from "zod";

const BaseAccommodationSchema = z.object({
  needAccommodation: z.enum(["yes", "no"]),

  checkInDate: z.date().optional(),
  checkInTime: z.string().optional(),

  checkOutDate: z.date().optional(),
  checkOutTime: z.string().optional(),

  accomMaleMembers: z.number().min(0),
  accomFemaleMembers: z.number().min(0),

  maleDetails: z
    .array(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
      }),
    )
    .optional(),

  femaleDetails: z
    .array(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
      }),
    )
    .optional(),
});

const NoAccommodationSchema = BaseAccommodationSchema.extend({
  needAccommodation: z.literal("no"),
});

const YesAccommodationSchema = BaseAccommodationSchema.extend({
  needAccommodation: z.literal("yes"),
}).superRefine((data, ctx) => {
  if (!data.checkInDate) {
    ctx.addIssue({
      code: "custom",
      path: ["checkInDate"],
      message: "Check-in date is required",
    });
  }
  if (!data.checkInTime || data.checkInTime.trim() === "") {
    ctx.addIssue({
      code: "custom",
      path: ["checkInTime"],
      message: "Check-in time is required",
    });
  }

  if (!data.checkOutDate) {
    ctx.addIssue({
      code: "custom",
      path: ["checkOutDate"],
      message: "Check-out date is required",
    });
  }
  if (!data.checkOutTime || data.checkOutTime.trim() === "") {
    ctx.addIssue({
      code: "custom",
      path: ["checkOutTime"],
      message: "Check-out time is required",
    });
  }

  if (data.accomMaleMembers > 0) {
    const males = (data.maleDetails ?? []) as {
      name?: string;
      phone?: string;
    }[];
    for (let i = 0; i < data.accomMaleMembers; i++) {
      const name = males[i]?.name ?? "";
      if (name.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["maleDetails", i, "name"],
          message: `Male member ${i + 1} name is required`,
        });
      }
    }
  }

  if (data.accomFemaleMembers > 0) {
    const females = (data.femaleDetails ?? []) as {
      name?: string;
      phone?: string;
    }[];
    for (let i = 0; i < data.accomFemaleMembers; i++) {
      const name = females[i]?.name ?? "";
      if (name.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["femaleDetails", i, "name"],
          message: `Female member ${i + 1} name is required`,
        });
      }
    }
  }
});

const AccommodationSchema = z.union([
  NoAccommodationSchema,
  YesAccommodationSchema,
]);

export default function Accomodate() {
  const { formData, updateForm } = useFormStore();

  const checkRequired = (data: FormData) => {
    const parsed = AccommodationSchema.safeParse(data);

    const isSection3Valid = parsed.success;

    const newArr = [...data.nextSectionEnable];
    newArr[data.sectionNumber] = isSection3Valid;
    updateForm({ nextSectionEnable: newArr });
  };

  // Debouncing for the input fields
  const debouncedFormUpdate = debouncedUpdate((key: string, value: string) => {
    const updated = {
      ...formData,
      [key]: value,
    };

    updateForm({ [key]: value });
    checkRequired(updated);
  });

  // Arrival & Departure Date open state
  const [openCheckinDate, setOpenCheckinDate] = useState(false);
  const [openCheckOutDate, setOpenCheckOutDate] = useState(false);

  const maleMemberElementsJSX = Array.from({
    length: formData.accomMaleMembers,
  }).map((_, index) => {
    const member = formData.maleDetails?.[index] || { name: "", phone: "" };

    return (
      <div key={index} className="flex gap-4 mt-3">
        <div className="flex-1">
          <FieldLabel htmlFor={`male-name-${index}`} className="tracking-tight">
            Member(M) {index + 1} Name *
          </FieldLabel>
          <Input
            id={`male-name-${index}`}
            placeholder="Enter name"
            defaultValue={member.name.toString()}
            onChange={(e) => {
              const updated = [...(formData.maleDetails || [])];
              while (updated.length < formData.accomMaleMembers)
                updated.push({ name: "", phone: "" });
              updated[index] = { ...updated[index], name: e.target.value };
              debouncedFormUpdate("maleDetails", updated);
            }}
          />
        </div>

        <div className="flex-1">
          <FieldLabel htmlFor={`male-phone-${index}`}>Phone</FieldLabel>
          <Input
            id={`male-phone-${index}`}
            placeholder="Enter phone number"
            defaultValue={member.phone.toString()}
            onChange={(e) => {
              const updated = [...(formData.maleDetails || [])];
              while (updated.length < formData.accomMaleMembers)
                updated.push({ name: "", phone: "" });
              updated[index] = { ...updated[index], phone: e.target.value };
              debouncedFormUpdate("maleDetails", updated);
            }}
          />
        </div>
      </div>
    );
  });

  const femaleMemberElementsJSX = Array.from({
    length: formData.accomFemaleMembers,
  }).map((_, index) => {
    const member = formData.femaleDetails?.[index] || { name: "", phone: "" };

    return (
      <div key={index} className="flex gap-4 mt-3">
        <Field className="flex-1">
          <FieldLabel
            htmlFor={`female-name-${index}`}
            className="tracking-tight"
          >
            Member(F) {index + 1} Name *
          </FieldLabel>
          <Input
            id={`female-name-${index}`}
            placeholder="Enter name"
            defaultValue={member.name.toString()}
            onChange={(e) => {
              const updated = [...(formData.femaleDetails || [])];
              while (updated.length < formData.accomFemaleMembers)
                updated.push({ name: "", phone: "" });
              updated[index] = { ...updated[index], name: e.target.value };
              debouncedFormUpdate("femaleDetails", updated);
            }}
          />
        </Field>

        <Field className="flex-1">
          <FieldLabel htmlFor={`female-phone-${index}`}>Phone</FieldLabel>
          <Input
            id={`female-phone-${index}`}
            placeholder="Enter phone number"
            defaultValue={member.phone.toString()}
            onChange={(e) => {
              const updated = [...(formData.femaleDetails || [])];
              while (updated.length < formData.accomFemaleMembers)
                updated.push({ name: "", phone: "" });
              updated[index] = { ...updated[index], phone: e.target.value };
              debouncedFormUpdate("femaleDetails", updated);
            }}
          />
        </Field>
      </div>
    );
  });

  return (
    <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Accommodation Details</FieldLegend>
          <FieldDescription>
            Accommodation details for the student and previously mentioned
            accompanies.
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="accomodation?">
                Does the student need accommodation? *
              </FieldLabel>

              <RadioGroup
                value={formData.needAccommodation.toString()}
                onValueChange={(val) => {
                  console.log(val);
                  updateForm({ needAccommodation: val });
                }}
                id="accomodation"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="yes" id="yes-accom" />
                  <Label htmlFor="yes-accom">Yes</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="no" id="no-accom" />
                  <Label htmlFor="no-accom">No</Label>
                </div>
              </RadioGroup>
            </Field>

            {formData.needAccommodation == "yes" && (
              <>
                {formData.numMaleMembers != 0 && (
                  <Field>
                    <FieldLabel htmlFor="male-acoompany">
                      Number of male members: {formData.accomMaleMembers}
                    </FieldLabel>
                    <Slider
                      defaultValue={[formData.accomMaleMembers]}
                      max={formData.numMaleMembers}
                      step={1}
                      onValueChange={([v]) => {
                        const updated = {
                          ...formData,
                          accomMaleMembers: v,
                        };
                        updateForm({ accomMaleMembers: v });
                        checkRequired(updated);
                      }}
                    />
                    {maleMemberElementsJSX}
                  </Field>
                )}

                {formData.numFemaleMembers != 0 && (
                  <Field>
                    <FieldLabel htmlFor="female-acoompany">
                      Number of female members: {formData.accomFemaleMembers}
                    </FieldLabel>
                    <Slider
                      defaultValue={[formData.accomFemaleMembers]}
                      max={formData.numFemaleMembers}
                      step={1}
                      onValueChange={([v]) => {
                        const updated = {
                          ...formData,
                          accomFemaleMembers: v,
                        };
                        updateForm({ accomFemaleMembers: v });
                        checkRequired(updated);
                      }}
                    />
                    {femaleMemberElementsJSX}
                  </Field>
                )}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Check-in Date Field */}
                  <Field>
                    <FieldLabel htmlFor="checkin-date">Check-in Date *</FieldLabel>
                    <Popover
                      open={openCheckinDate}
                      onOpenChange={setOpenCheckinDate}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="checkin-date"
                          className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                        >
                          {formData.checkInDate
                            ? formData.checkInDate.toLocaleDateString("en-IN")
                            : "Select date"}
                          <CalendarIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={formData.checkInDate}
                          captionLayout="dropdown"
                          disabled={{
                            before: formData.arrivalDate || new Date(),
                            after: formData.departureDate,
                          }}
                          onSelect={(date) => {
                            const updated = {
                              ...formData,
                              checkInDate: date,
                            };
                            updateForm({ checkInDate: date });
                            checkRequired(updated);
                            setOpenCheckinDate(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>

                  {/* Check-in Time Field */}
                  <Field>
                    <FieldLabel htmlFor="checkin-time">Check in Time *</FieldLabel>
                    <Input
                      type="time"
                      id="checkin-time"
                      defaultValue={formData.checkInTime.toString() || "00:00"}
                      onChange={(e) =>
                        debouncedFormUpdate("checkInTime", e.target.value)
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </Field>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  {/* Checkout Date Field */}
                  <Field>
                    <FieldLabel htmlFor="checkout-date">
                      Departure Date *
                    </FieldLabel>
                    <Popover
                      open={openCheckOutDate}
                      onOpenChange={setOpenCheckOutDate}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="checkout-date"
                          className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                        >
                          {formData.checkOutDate
                            ? formData.checkOutDate.toLocaleDateString("en-IN")
                            : "Select date"}
                          <CalendarIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={formData.checkOutDate}
                          captionLayout="dropdown"
                          disabled={{
                            before: formData.checkInDate || new Date(),
                            after: formData.departureDate,
                          }}
                          onSelect={(date) => {
                            const updated = {
                              ...formData,
                              checkOutDate: date,
                            };
                            updateForm({ checkOutDate: date });
                            checkRequired(updated);
                            setOpenCheckOutDate(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>

                  {/* Checkout Time Field */}
                  <Field>
                    <FieldLabel htmlFor="checkout-time">
                      Departure Time *
                    </FieldLabel>
                    <Input
                      type="time"
                      id="checkout-time"
                      defaultValue={formData.checkOutTime.toString() || "00:00"}
                      onChange={(e) =>
                        debouncedFormUpdate("checkOutTime", e.target.value)
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </Field>
                </div>
              </>
            )}


          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
