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
import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type FormData, useFormStore } from "@/store/formStore";
import debouncedUpdate from "@/utils/debounce";
import { z } from "zod";

export const LogisticsSchema = z
  .object({
    arrivalDate: z.date(),
    arrivalTime: z.string().trim().min(1),
    needPickup: z.string().min(1),
    arrivalMode: z.string(),
    pickupPoint: z.string(),
    departureDate: z.date(),
    departureTime: z.string().trim().min(1),
    needDrop: z.string().min(1),
    departureMode: z.string(),
    dropPoint: z.string(),
  })
  .refine((data) => {
    if (data.needPickup === "yes") {
      return (
        data.arrivalMode.trim().length > 0 && data.pickupPoint.trim().length > 0
      );
    }
    return true;
  })
  .refine((data) => {
    if (data.needDrop === "yes") {
      return (
        data.departureMode.trim().length > 0 && data.dropPoint.trim().length > 0
      );
    }
    return true;
  });

export default function LogisticsInfo() {
  const { formData, updateForm } = useFormStore();

  // Setting the default time as the value as soon as component loads
  useEffect(() => {
    const updates: Partial<FormData> = {};

    if (!formData.arrivalTime || formData.arrivalTime === "") {
      updates.arrivalTime = "10:00";
    }
    if (!formData.departureTime || formData.departureTime === "") {
      updates.departureTime = "18:00";
    }
    if (Object.keys(updates).length > 0) {
      updateForm(updates);
    }
  }, []);

  const checkRequired = (data: FormData) => {
    console.log(data);
    const parsed = LogisticsSchema.safeParse(data);

    const isSection3Valid = parsed.success;
    console.log(parsed.error);
    const newArr = [...data.nextSectionEnable];
    newArr[data.sectionNumber] = isSection3Valid;
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

  // Arrival & Departure Date open state
  const [openArrivalDate, setOpenArrivalDate] = useState(false);
  const [openDepartureDate, setOpenDepartureDate] = useState(false);

  // Arrival & Departure month states so we can open the calendar back up at saved month
  const [arrivalMonth, setArrivalMonth] = useState<Date | undefined>(undefined);
  const [departureMonth, setDepartureMonth] = useState<Date | undefined>(
    undefined,
  );

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
          <FieldLegend>Logistics</FieldLegend>
          <FieldDescription>
            Please enter the CORRECT information about arrival and departure
            information
          </FieldDescription>
          <FieldGroup>
            <div className="flex flex-col md:flex-row gap-3">
              {/* Arrival Date Field */}
              <Field>
                {formData.showErrors &&
                  !LogisticsSchema.shape.arrivalDate.safeParse(
                    formData.arrivalDate,
                  ).success && (
                    <div className="text-red-600 text-sm">
                      Arrival Date is required
                    </div>
                  )}
                <FieldLabel htmlFor="arrival-date">Arrival Date *</FieldLabel>
                <Popover
                  open={openArrivalDate}
                  onOpenChange={(isOpenArrival) => {
                    setOpenArrivalDate(isOpenArrival);

                    if (isOpenArrival) {
                      if (formData.arrivalDate) {
                        setArrivalMonth(formData.arrivalDate);
                      } else {
                        setArrivalMonth(undefined);
                      }
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="arrival-date"
                      className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                    >
                      {formData.arrivalDate
                        ? formData.arrivalDate.toLocaleDateString("en-IN")
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
                      selected={formData.arrivalDate}
                      month={arrivalMonth}
                      onMonthChange={setArrivalMonth}
                      captionLayout="dropdown"
                      disabled={{ before: new Date() }}
                      onSelect={(date) => {
                        const updated = {
                          ...formData,
                          arrivalDate: date,
                        };
                        updateForm({ arrivalDate: date });
                        checkRequired(updated);
                        setOpenArrivalDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              {/* Arrival Time Field */}
              <Field>
                {formData.showErrors &&
                  !LogisticsSchema.shape.arrivalTime.safeParse(
                    formData.arrivalTime,
                  ).success && (
                    <div className="text-red-600 text-sm">
                      Arrival Time is required
                    </div>
                  )}
                <FieldLabel htmlFor="arrival-time">Arrival Time *</FieldLabel>
                <Input
                  type="time"
                  id="arrival-time"
                  defaultValue={formData.arrivalTime.toString() || "10:00"}
                  onChange={(e) =>
                    debouncedFormUpdate("arrivalTime", e.target.value)
                  }
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </div>

            {/* Checking if student need pickup facility (if yes we ask for mode of travel and pickup point) */}
            <Field>
              {formData.showErrors &&
                !LogisticsSchema.shape.needPickup.safeParse(formData.needPickup)
                  .success && (
                  <div className="text-red-600 text-sm">
                    This field is required
                  </div>
                )}
              <FieldLabel>Does the student need pickup facility? *</FieldLabel>

              <RadioGroup
                value={formData.needPickup.toString()}
                onValueChange={(val) => {
                  console.log(val);
                  // Resetting the pickupPoint and arrivalMode if no pickup is req
                  if (val === "no") {
                    const updated = {
                      ...formData,
                      needPickup: val,
                      arrivalMode: "",
                      pickupPoint: "",
                    };
                    updateForm({
                      needPickup: val,
                      arrivalMode: "",
                      pickupPoint: "",
                    });
                    checkRequired(updated);
                  } else {
                    const updated = {
                      ...formData,
                      needPickup: val,
                    };
                    updateForm({ needPickup: val });
                    checkRequired(updated);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="yes" id="pickup-yes" />
                  <Label htmlFor="pickup-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="no" id="pickup-no" />
                  <Label htmlFor="pickup-no">No</Label>
                </div>
              </RadioGroup>
            </Field>

            {formData.needPickup === "yes" && (
              <>
                {/* Arrival Mode of Travel */}
                <Field>
                  {formData.showErrors &&
                    formData.needPickup == "yes" &&
                    formData.arrivalMode == "" && (
                      <div className="text-red-600 text-sm">
                        Mode of Arrival is required
                      </div>
                    )}
                  <FieldLabel htmlFor="arrival-mode">
                    Mode of Travel (Arrival) *
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Train"
                    id="arrival-mode"
                    defaultValue={formData.arrivalMode.toString()}
                    onChange={(e) =>
                      debouncedFormUpdate("arrivalMode", e.target.value)
                    }
                  />
                </Field>

                {/* Pickup Point Landmark field */}
                <Field>
                  {formData.showErrors &&
                    formData.needPickup == "yes" &&
                    formData.pickupPoint == "" && (
                      <div className="text-red-600 text-sm">
                        Pickup Point is required
                      </div>
                    )}
                  <FieldLabel htmlFor="pickup-point">Pickup Point *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Landmark"
                    id="pickup-point"
                    defaultValue={formData.pickupPoint.toString()}
                    onChange={(e) =>
                      debouncedFormUpdate("pickupPoint", e.target.value)
                    }
                  />
                </Field>
              </>
            )}

            <div className="flex flex-col md:flex-row gap-3">
              {/* Departure Date Field */}
              <Field>
                {formData.showErrors &&
                  !LogisticsSchema.shape.departureDate.safeParse(
                    formData.departureDate,
                  ).success && (
                    <div className="text-red-600 text-sm">
                      Departure Date is required
                    </div>
                  )}
                <FieldLabel htmlFor="departure-date">
                  Departure Date *
                </FieldLabel>
                <Popover
                  open={openDepartureDate}
                  onOpenChange={(isOpenDeparture) => {
                    setOpenDepartureDate(isOpenDeparture);

                    if (isOpenDeparture) {
                      if (formData.departureDate) {
                        setDepartureMonth(formData.departureDate);
                      } else {
                        setDepartureMonth(undefined);
                      }
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="departure-date"
                      className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                    >
                      {formData.departureDate
                        ? formData.departureDate.toLocaleDateString("en-IN")
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
                      selected={formData.departureDate}
                      month={departureMonth}
                      onMonthChange={setDepartureMonth}
                      captionLayout="dropdown"
                      disabled={{ before: formData.arrivalDate || new Date() }}
                      onSelect={(date) => {
                        const updated = {
                          ...formData,
                          departureDate: date,
                        };
                        updateForm({ departureDate: date });
                        checkRequired(updated);
                        setOpenDepartureDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              {/* Departure Time Field */}
              <Field>
                {formData.showErrors &&
                  !LogisticsSchema.shape.departureTime.safeParse(
                    formData.departureTime,
                  ).success && (
                    <div className="text-red-600 text-sm">
                      Departure Time is required
                    </div>
                  )}
                <FieldLabel htmlFor="departure-time">
                  Departure Time *
                </FieldLabel>
                <Input
                  type="time"
                  id="departure-time"
                  defaultValue={formData.departureTime.toString() || "18:00"}
                  onChange={(e) =>
                    debouncedFormUpdate("departureTime", e.target.value)
                  }
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </div>

            {/* Checking if student needs drop facility (if yes we ask for mode of travel and dropoff point) */}
            <Field>
              {formData.showErrors &&
                !LogisticsSchema.shape.needDrop.safeParse(formData.needDrop)
                  .success && (
                  <div className="text-red-600 text-sm">
                    This field is required
                  </div>
                )}
              <FieldLabel>Does the student need drop facility? *</FieldLabel>

              <RadioGroup
                key={formData.needDrop.toString()}
                value={formData.needDrop.toString()}
                onValueChange={(val) => {
                  console.log(val);
                  // Resetting the dropPoint and departureMode if no drop required
                  if (val === "no") {
                    const updated = {
                      ...formData,
                      needDrop: val,
                      departureMode: "",
                      dropPoint: "",
                    };
                    updateForm({
                      needDrop: val,
                      departureMode: "",
                      dropPoint: "",
                    });
                    checkRequired(updated);
                  } else {
                    const updated = {
                      ...formData,
                      needDrop: val,
                    };
                    updateForm({ needDrop: val });
                    checkRequired(updated);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="yes" id="drop-yes" />
                  <Label htmlFor="drop-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="no" id="drop-no" />
                  <Label htmlFor="drop-no">No</Label>
                </div>
              </RadioGroup>
            </Field>

            {formData.needDrop === "yes" && (
              <>
                {/* Departure Mode of Travel */}
                <Field>
                  {formData.showErrors &&
                    formData.needDrop == "yes" &&
                    formData.departureMode == "" && (
                      <div className="text-red-600 text-sm">
                        Mode of Departure is required
                      </div>
                    )}
                  <FieldLabel htmlFor="departure-mode">
                    Mode of Travel (Departure) *
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Train"
                    id="departure-mode"
                    defaultValue={formData.departureMode.toString()}
                    onChange={(e) =>
                      debouncedFormUpdate("departureMode", e.target.value)
                    }
                  />
                </Field>

                {/* Departure Point Landmark field */}
                <Field>
                  {formData.showErrors &&
                    formData.needDrop == "yes" &&
                    formData.dropPoint == "" && (
                      <div className="text-red-600 text-sm">
                        Drop off Point is required
                      </div>
                    )}
                  <FieldLabel htmlFor="drop-point">Drop off Point *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Landmark"
                    id="drop-point"
                    defaultValue={formData.dropPoint.toString()}
                    onChange={(e) =>
                      debouncedFormUpdate("dropPoint", e.target.value)
                    }
                  />
                </Field>
              </>
            )}
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
