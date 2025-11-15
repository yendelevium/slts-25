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
import { useState, useEffect } from "react";
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
  checkInDate: z.date(),
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutDate: z.date(),
  checkOutTime: z.string().min(1, "Check-out time is required"),
}).superRefine((data, ctx) => {
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

  // Setting the default time as the value as soon as component loads
  useEffect(() => {
    const updates: Partial<FormData> = {};

    if (!formData.checkInTime || formData.checkInTime === "") {
      updates.checkInTime = "10:00";
    }
    if (!formData.checkOutTime || formData.checkOutTime === "") {
      updates.checkOutTime = "18:00";
    }
    if (Object.keys(updates).length > 0) {
      updateForm(updates);
    }
  }, []);

  const checkRequired = (data: FormData) => {
    const parsed = AccommodationSchema.safeParse(data);

    const isSection3Valid = parsed.success;

    const newArr = [...data.nextSectionEnable];
    newArr[data.sectionNumber] = isSection3Valid;
    console.log("Accommodation Section Valid:", isSection3Valid);
    if (isSection3Valid) {
      updateForm({ nextSectionEnable: newArr, showErrors: false });
    } else {
      updateForm({ nextSectionEnable: newArr });
    }
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

  // Checkin & Checkout Date open state
  const [openCheckinDate, setOpenCheckinDate] = useState(false);
  const [openCheckOutDate, setOpenCheckOutDate] = useState(false);

  // Checkin & Checkout month states so we can open the calendar back up at saved month
  const [checkinMonth, setCheckinMonth] = useState<Date | undefined>(undefined);
  const [checkoutMonth, setCheckoutMonth] = useState<Date | undefined>(
    undefined,
  );

  const maleMemberElementsJSX = Array.from({
    length: formData.accomMaleMembers,
  }).map((_, index) => {
    const member = formData.maleDetails?.[index] || { name: "", phone: "" };

    return (
      <div key={index} className="flex gap-4 mt-3">
        <div className="flex-1">
          <FieldLabel htmlFor={`male-name-${index}`} className="tracking-tight">
            M{index + 1} Name <span className="text-red-600">*</span>
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
          <FieldLabel htmlFor={`male-phone-${index}`}>
            M{index + 1} Phone
          </FieldLabel>
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
            F{index + 1} Name <span className="text-red-600">*</span>
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
          <FieldLabel htmlFor={`female-phone-${index}`}>
            F{index + 1} Phone
          </FieldLabel>
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
          <FieldLegend>Accommodation Details</FieldLegend>
          <FieldDescription>
            Accommodation details for the student and previously mentioned
            accompanies.
          </FieldDescription>

          <FieldGroup>
            <Field>
              {formData.showErrors &&
                !(
                  NoAccommodationSchema.shape.needAccommodation.safeParse(
                    formData.needAccommodation,
                  ).success ||
                  YesAccommodationSchema.shape.needAccommodation.safeParse(
                    formData.needAccommodation,
                  ).success
                ) && (
                  <div className="text-red-600 text-sm">
                    This field is required
                  </div>
                )}
              <FieldLabel htmlFor="accomodation?">
                Does the student need accommodation? <span className="text-red-600">*</span>
              </FieldLabel>

              <RadioGroup
                value={formData.needAccommodation.toString()}
                onValueChange={(val) => {
                  const updated = {
                    ...formData,
                    needAccommodation: val,
                  };
                  updateForm({ needAccommodation: val });
                  checkRequired(updated);
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
                    {formData.showErrors &&
                      (formData.maleDetails ?? []).filter((m) =>
                        m?.name?.trim(),
                      ).length < formData.accomMaleMembers && (
                        <div className="text-red-600 text-sm">
                          Please fill in all male member details
                        </div>
                      )}
                    <FieldLabel htmlFor="male-acoompany">
                      Number of male members needing accomodation:{" "}
                      {formData.accomMaleMembers}
                    </FieldLabel>
                    <Slider
                      defaultValue={[formData.accomMaleMembers]}
                      max={formData.numMaleMembers}
                      step={1}
                      onValueChange={([v]) => {
                        const updated = {
                          ...formData,
                          accomMaleMembers: v,
                          maleDetails: formData.maleDetails?.slice(0, v),
                        };
                        updateForm({
                          accomMaleMembers: v,
                          maleDetails: formData.maleDetails?.slice(0, v),
                        });
                        checkRequired(updated);
                      }}
                    />
                    {maleMemberElementsJSX}
                  </Field>
                )}

                {formData.numFemaleMembers != 0 && (
                  <Field>
                    {formData.showErrors &&
                      (formData.femaleDetails ?? []).filter((f) =>
                        f?.name?.trim(),
                      ).length < formData.accomFemaleMembers && (
                        <div className="text-red-600 text-sm">
                          Please fill in all female member details
                        </div>
                      )}
                    <FieldLabel htmlFor="female-acoompany">
                      Number of female members needing accommodation:{" "}
                      {formData.accomFemaleMembers}
                    </FieldLabel>
                    <Slider
                      defaultValue={[formData.accomFemaleMembers]}
                      max={formData.numFemaleMembers}
                      step={1}
                      onValueChange={([v]) => {
                        const updated = {
                          ...formData,
                          accomFemaleMembers: v,
                          femaleDetails: formData.femaleDetails?.slice(0, v),
                        };
                        updateForm({
                          accomFemaleMembers: v,
                          femaleDetails: formData.femaleDetails?.slice(0, v),
                        });
                        checkRequired(updated);
                      }}
                    />
                    {femaleMemberElementsJSX}
                  </Field>
                )}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Check-in Date Field */}
                  <Field>
                    {formData.showErrors &&
                      !YesAccommodationSchema.shape.checkInDate.safeParse(
                        formData.checkInDate,
                      ).success && (
                        <div className="text-red-600 text-sm">
                          Check-in Date is required
                        </div>
                      )}
                    <FieldLabel htmlFor="checkin-date">
                      Check-in Date <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Popover
                      open={openCheckinDate}
                      onOpenChange={(isOpenCheckin) => {
                        setOpenCheckinDate(isOpenCheckin);

                        if (isOpenCheckin) {
                          if (formData.checkInDate) {
                            setCheckinMonth(formData.checkInDate);
                          } else {
                            setCheckinMonth(undefined);
                          }
                        }
                      }}
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
                          month={checkinMonth}
                          onMonthChange={setCheckinMonth}
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
                    {formData.showErrors &&
                      !YesAccommodationSchema.shape.checkInTime.safeParse(
                        formData.checkInTime,
                      ).success && (
                        <div className="text-red-600 text-sm">
                          Check-in Time is required
                        </div>
                      )}
                    <FieldLabel htmlFor="checkin-time">
                      Check in Time <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      type="time"
                      id="checkin-time"
                      defaultValue={formData.checkInTime.toString() || "10:00"}
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
                    {formData.showErrors &&
                      !YesAccommodationSchema.shape.checkOutDate.safeParse(
                        formData.checkOutDate,
                      ).success && (
                        <div className="text-red-600 text-sm">
                          Check-out Date is required
                        </div>
                      )}
                    <FieldLabel htmlFor="checkout-date">
                      Check-out Date <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Popover
                      open={openCheckOutDate}
                      onOpenChange={(isOpenCheckout) => {
                        setOpenCheckOutDate(isOpenCheckout);

                        if (isOpenCheckout) {
                          if (formData.checkOutDate) {
                            setCheckoutMonth(formData.checkOutDate);
                          } else {
                            setCheckoutMonth(undefined);
                          }
                        }
                      }}
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
                          month={checkoutMonth}
                          onMonthChange={setCheckoutMonth}
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
                    {formData.showErrors &&
                      !YesAccommodationSchema.shape.checkOutTime.safeParse(
                        formData.checkOutTime,
                      ).success && (
                        <div className="text-red-600 text-sm">
                          Check-out Time is required
                        </div>
                      )}
                    <FieldLabel htmlFor="checkout-time">
                      Check-out Time <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      type="time"
                      id="checkout-time"
                      defaultValue={formData.checkOutTime.toString() || "18:00"}
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
