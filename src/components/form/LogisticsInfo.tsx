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
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/store/formStore";
import debouncedUpdate from "@/utils/debounce";

export default function LogisticsInfo() {
	const { formData, updateForm } = useFormStore();

	// Debouncing for the input fields
	const debouncedFormUpdate = debouncedUpdate((key: string, value: string) => {
		updateForm({ [key]: value });
	});

	// Arrival & Departure Date open state
	const [openArrivalDate, setOpenArrivalDate] = useState(false);
	const [openDepartureDate, setOpenDepartureDate] = useState(false);

	return (
		<div className="mb-5 bg-white rounded-lg shadow-sm p-6">
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
								<FieldLabel htmlFor="arrival-date">Arrival Date</FieldLabel>
								<Popover
									open={openArrivalDate}
									onOpenChange={setOpenArrivalDate}
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
											<ChevronDownIcon />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto overflow-hidden p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={formData.arrivalDate}
											captionLayout="dropdown"
											disabled={{ before: new Date() }}
											onSelect={(date) => {
												updateForm({ arrivalDate: date });
												setOpenArrivalDate(false);
											}}
										/>
									</PopoverContent>
								</Popover>
							</Field>

							{/* Arrival Time Field */}
							<Field>
								<FieldLabel htmlFor="arrival-time">Arrival Time</FieldLabel>
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
							<FieldLabel>Does the student need pickup facility? *</FieldLabel>

							<RadioGroup
								value={formData.needPickup.toString()}
								onValueChange={(val) => {
									console.log(val);
									// Resetting the pickupPoint and arrivalMode if no pickup required
									if (val === "no") {
										updateForm({
											needPickup: val,
											arrivalMode: "",
											pickupPoint: "",
										});
									} else {
										updateForm({ needPickup: val });
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
								<FieldLabel htmlFor="departure-date">Departure Date</FieldLabel>
								<Popover
									open={openDepartureDate}
									onOpenChange={setOpenDepartureDate}
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
											<ChevronDownIcon />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto overflow-hidden p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={formData.departureDate}
											captionLayout="dropdown"
											disabled={{ before: formData.arrivalDate || new Date() }}
											onSelect={(date) => {
												updateForm({ departureDate: date });
												setOpenDepartureDate(false);
											}}
										/>
									</PopoverContent>
								</Popover>
							</Field>

							{/* Departure Time Field */}
							<Field>
								<FieldLabel htmlFor="departure-time">Departure Time</FieldLabel>
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
							<FieldLabel>Does the student need drop facility? *</FieldLabel>

							<RadioGroup
								value={formData.needDrop.toString()}
								onValueChange={(val) => {
									console.log(val);
									// Resetting the dropPoint and departureMode if no drop required
									if (val === "no") {
										updateForm({
											needDrop: val,
											departureMode: "",
											dropPoint: "",
										});
									} else {
										updateForm({ needDrop: val });
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
