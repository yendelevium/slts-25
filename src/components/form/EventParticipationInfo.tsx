import { 
  FieldGroup, 
  FieldDescription, 
  FieldLegend, 
  FieldSet,
  Field,
  FieldLabel
} from "../ui/field";
import { useFormStore } from "@/store/formStore";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function EventParticipationInfo() {
  const { formData, updateForm } = useFormStore()

  return (
    <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Event Participation</FieldLegend>
            <FieldDescription>
              Please enter the CORRECT information about the events you would like to participate in.
            </FieldDescription>

            <FieldGroup>
              {/* Contestant Info for Group 1 Participants */}
              {formData.group == "1" && (
                // Devotional Singing Field (Group Event)
                <Field>
                  <FieldLabel>
                    Do you want to participate in Devotional Singing? *
                  </FieldLabel>

                  <RadioGroup 
                    value={formData.devotionalSinging}
                    onValueChange={(val) => {
                        console.log(val)
                        updateForm({ devotionalSinging: val })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="yes" id="devotional-singing-yes" />
                      <Label htmlFor="devotional-singing-yes">Yes</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="no" id="devotional-singing-no" />
                      <Label htmlFor="devotional-singing-no">No</Label>
                    </div>
                  </RadioGroup>
                </Field>
              )}
            </FieldGroup>

        </FieldSet>
      </FieldGroup>
    </div>
  )
}
