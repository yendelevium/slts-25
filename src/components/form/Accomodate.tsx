import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Slider } from "@/components/ui/slider"

import { useFormStore } from "@/store/formStore"
import debouncedUpdate from "@/utils/debounce"

export default function Accomodate(){
    const { formData, updateForm } = useFormStore()
    // Defining it ONCE as a debounced function to update the form
    // But will need to repeat for all components as store is only accessible in functional components
    const debouncedFormUpdate = debouncedUpdate((key: string, value: string) => {
        updateForm({ [key]: value })
    })

    const maleMemberElementsJSX = Array.from({ length: formData.accomMaleMembers }).map((_, index) => {
        const member = formData.maleDetails?.[index] || { name: "", phone: "" }

        return (
            <div key={index} className="flex gap-4 mt-3">
            <div className="flex-1">
                <FieldLabel htmlFor={`male-name-${index}`}>
                Member(M) {index + 1} Name *
                </FieldLabel>
                <Input
                id={`male-name-${index}`}
                placeholder="Enter name"
                value={member.name.toString()}
                onChange={(e) => {
                    const updated = [...(formData.maleDetails || [])]
                    while (updated.length < formData.accomMaleMembers)
                    updated.push({ name: "", phone: "" })
                    updated[index] = { ...updated[index], name: e.target.value }
                    updateForm({ maleDetails: updated })
                }}
                />
            </div>

            <div className="flex-1">
                <FieldLabel htmlFor={`male-phone-${index}`}>
                Phone
                </FieldLabel>
                <Input
                id={`male-phone-${index}`}
                placeholder="Enter phone number"
                value={member.phone.toString()}
                onChange={(e) => {
                    const updated = [...(formData.maleDetails || [])]
                    while (updated.length < formData.accomMaleMembers)
                    updated.push({ name: "", phone: "" })
                    updated[index] = { ...updated[index], phone: e.target.value }
                    updateForm({ maleDetails: updated })
                    console.log(formData)
                }}
                />
            </div>
            </div>
        )
    })

    const femaleMemberElementsJSX = Array.from({ length: formData.accomFemaleMembers }).map((_, index) => {
        const member = formData.femaleDetails?.[index] || { name: "", phone: "" }

        return (
            <div key={index} className="flex gap-4 mt-3">
                <Field className="flex-1">
                    <FieldLabel htmlFor={`female-name-${index}`}>
                    Member(F) {index + 1} Name *
                    </FieldLabel>
                    <Input
                    id={`female-name-${index}`}
                    placeholder="Enter name"
                    value={member.name.toString()}
                    onChange={(e) => {
                        const updated = [...(formData.femaleDetails || [])]
                        while (updated.length < formData.accomFemaleMembers)
                        updated.push({ name: "", phone: "" })
                        updated[index] = { ...updated[index], name: e.target.value }
                        updateForm({ femaleDetails: updated })
                    }}
                    />
                </Field>

                <Field className="flex-1">
                    <FieldLabel htmlFor={`female-phone-${index}`}>
                    Phone
                    </FieldLabel>
                    <Input
                    id={`female-phone-${index}`}
                    placeholder="Enter phone number"
                    value={member.phone.toString()}
                    onChange={(e) => {
                        const updated = [...(formData.femaleDetails || [])]
                        while (updated.length < formData.accomFemaleMembers)
                        updated.push({ name: "", phone: "" })
                        updated[index] = { ...updated[index], phone: e.target.value }
                        updateForm({ femaleDetails: updated })
                        console.log(formData)
                    }}
                    />
                </Field>
            </div>
        )
    })


    return(
        <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
            <FieldGroup>
            <FieldSet>
                <FieldLegend>Accommodation Details</FieldLegend>
                <FieldDescription>
                Accommodation details for the student and previously mentioned accompanies.
                </FieldDescription>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="accomodation?">
                        Does the student need accommodation? *
                        </FieldLabel>

                        <RadioGroup 
                            value={formData.needAccommodation.toString()}
                            onValueChange={(val) => {
                                console.log(val)
                                updateForm({ needAccommodation: val })
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

                    {formData.needAccommodation == "yes" &&
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="male-acoompany">Number of male members: {formData.accomMaleMembers}</FieldLabel>
                                <Slider defaultValue={[formData.accomMaleMembers]} max={10} step={1} onValueChange={([v])=>{
                                    updateForm({accomMaleMembers: v})

                                }}/>
                                {maleMemberElementsJSX}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="female-acoompany">Number of female members: {formData.accomFemaleMembers}</FieldLabel>
                                <Slider defaultValue={[formData.accomFemaleMembers]} max={10} step={1} onValueChange={([v])=>{
                                    updateForm({accomFemaleMembers: v})
                                }}/>
                                {femaleMemberElementsJSX}
                            </Field>
                        </FieldSet>

                    }
                </FieldGroup>
            </FieldSet>
            </FieldGroup>
        </div>
    )
}