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

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import { useFormStore } from "@/store/formStore";
import debouncedUpdate from "@/utils/debounce";

export default function Accompany() {
	const { formData, updateForm } = useFormStore();

	// Defining it ONCE as a debounced function to update the form
	// But will need to repeat for all components as store is only accessible in functional components
	const debouncedFormUpdate = debouncedUpdate((key: string, value: string) => {
		updateForm({ [key]: value });
	});

	const genderElementsJSX = ["Male", "Female"].map((gender) => {
		return (
			<Button
				key={gender}
				onClick={() => {
					// TODO: Update store to set the chosen gender...
					updateForm({ pocGender: gender });
				}}
				variant="outline"
				// size="lg"
				className={`flex items-center gap-2 cursor-pointer font-normal 
                ${formData.pocGender === gender ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`}
			>
				{gender}
			</Button>
		);
	});

	return (
		<div className="mb-5 bg-white rounded-lg shadow-sm p-6">
			<FieldGroup>
				<FieldSet>
					<FieldLegend>
						Accompanying Adults/Non-Participating Siblings
					</FieldLegend>
					<FieldDescription>
						Information about adults and non-participating siblings accompanying
						the student
					</FieldDescription>

					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="adults-accompanying">
								Are adults/non-participating siblings accompanying? *
							</FieldLabel>

							<RadioGroup
								value={formData.adultsAccompanying.toString()}
								onValueChange={(val) => {
									console.log(val);
									updateForm({ adultsAccompanying: val });
								}}
								id="adults-accompanying"
							>
								<div className="flex items-center gap-3">
									<RadioGroupItem value="yes" id="yes-accompany" />
									<Label htmlFor="yes-accompany">Yes</Label>
								</div>
								<div className="flex items-center gap-3">
									<RadioGroupItem value="no" id="no-accompany" />
									<Label htmlFor="no-accompany">No</Label>
								</div>
							</RadioGroup>
						</Field>
						{formData.adultsAccompanying == "yes" && (
							<FieldSet>
								<Field>
									<FieldLabel htmlFor="male-acoompany">
										Number of male members: {formData.numMaleMembers}
									</FieldLabel>
									<Slider
										defaultValue={[formData.numMaleMembers]}
										max={10}
										step={1}
										onValueChange={([v]) => {
											updateForm({ numMaleMembers: v });
										}}
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="female-acoompany">
										Number of female members: {formData.numFemaleMembers}
									</FieldLabel>
									<Slider
										defaultValue={[formData.numFemaleMembers]}
										max={10}
										step={1}
										onValueChange={([v]) => {
											updateForm({ numFemaleMembers: v });
										}}
									/>
								</Field>

								<FieldSet>
									<FieldLegend>Point Of Contact</FieldLegend>
									<FieldDescription>
										Information about the point of contact for all accompanying
										members
									</FieldDescription>

									<div className="flex gap-4">
										<div className="flex-1">
											{/* Name, Phone */}
											<Field>
												<FieldLabel htmlFor="poc-name">Name *</FieldLabel>
												<Input
													type="text"
													placeholder="Yash"
													id="poc-name"
													defaultValue={formData.pocName.toString()}
													onChange={(e) =>
														debouncedFormUpdate("pocName", e.target.value)
													}
												/>
											</Field>
										</div>

										<div className="flex-1">
											<Field>
												<FieldLabel htmlFor="poc-phone">Phone *</FieldLabel>
												<Input
													type="text"
													placeholder="1234567890"
													id="poc-phone"
													defaultValue={formData.pocPhone.toString()}
													onChange={(e) =>
														debouncedFormUpdate("pocPhone", e.target.value)
													}
												/>
											</Field>
										</div>
									</div>

									{/* Gender */}
									<Field>
										<FieldLabel htmlFor="gender">Gender *</FieldLabel>
										<div className="flex flex-wrap gap-3">
											{genderElementsJSX}
										</div>
									</Field>

									{/* Relation */}
									<Field>
										<FieldLabel htmlFor="pocRelation">Relation *</FieldLabel>

										<RadioGroup
											value={formData.pocRelation.toString()}
											onValueChange={(val) => {
												console.log(val);
												updateForm({ pocRelation: val });
											}}
											className="flex flex-wrap"
										>
											<div className="flex items-center gap-3">
												<RadioGroupItem value="Father" id="Father" />
												<Label htmlFor="Father">Father</Label>
											</div>
											<div className="flex items-center gap-3">
												<RadioGroupItem value="Mother" id="Mother" />
												<Label htmlFor="Mothered">Mother</Label>
											</div>
											<div className="flex items-center gap-3">
												<RadioGroupItem value="Guru" id="Guru" />
												<Label htmlFor="Guru">Guru</Label>
											</div>
											<div className="flex items-center gap-3">
												<RadioGroupItem
													value="Legal Guardian"
													id="Legal Guardian"
												/>
												<Label htmlFor="Legal Guardian">Legal Guardian</Label>
											</div>
										</RadioGroup>
									</Field>

									{/* Age */}
									<Field>
										<FieldLabel htmlFor="poc-age">Age *</FieldLabel>

										<RadioGroup
											value={formData.pocAge.toString()}
											onValueChange={(val) => {
												console.log(val);
												console.log(formData);
												updateForm({ pocAge: val });
											}}
											className="flex flex-wrap"
										>
											<div className="flex items-center gap-3">
												<RadioGroupItem value="18-65" id="18-65" />
												<Label htmlFor="18-65">18-65</Label>
											</div>
											<div className="flex items-center gap-3">
												<RadioGroupItem value="65+" id="65+" />
												<Label htmlFor="65+">65+</Label>
											</div>
										</RadioGroup>
									</Field>
								</FieldSet>
							</FieldSet>
						)}
					</FieldGroup>
				</FieldSet>
			</FieldGroup>
		</div>
	);
}
