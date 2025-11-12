
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function StudentInfo() {
    // TODO: Replace these states with the TanStack store later when I actually write the store lol
    // The states for which group the student is in, and whether he has passed the group 2 exam or not (only if grp 3 is selected)
    const [activeGroup, setActiveGroup] = useState<string | null>(null)
    const [passed, setPassed] = useState<string | null>(null)

    const groupElementsJSX = ["1", "2", "3", "4"].map(group => {
        return(
            <Button
            key={group}
            onClick={()=>{
                // TODO: Update store to set the chosen group...
                setActiveGroup(group)

                // Setting `passed` to null if the group isn't group 3
                if(group!="3"){
                    setPassed(null)
                }

            }}
            variant="outline"
            // I'm using a simple logic to show which button was selected
            // Using ! for the selected style as shadCN hower continues to be on when i select making it look bad
            // Maybe it won't be an issue in phone, but it sure is in a PC
            className={
                `flex items-center gap-2 cursor-pointer font-normal 
                ${activeGroup === group ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`
            }
            >
            Group {group}
            </Button>
        )
    });

    return (
        <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
            <FieldGroup>
            <FieldSet>
                <FieldLegend>Student Information</FieldLegend>
                <FieldDescription>
                Please enter the CORRECT information about the participation StudentInfo
                </FieldDescription>

                {/* Group selection field */}
                <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="student-group">
                    Select Group *
                    </FieldLabel>

                    <div className="flex flex-wrap gap-3">
                        {groupElementsJSX}
                    </div>
                </Field>

                {/* Pop-up for grp 2 pass or not if the selected group is 3 */}
                {activeGroup  == "3" && (
                    <Field>
                        <FieldLabel htmlFor="passed-grp2-exam">
                        Passed Group 2 Exam? *
                        </FieldLabel>

                        {/* TODO: update pass-state of radio button to Tanstack Store */}
                        <RadioGroup 
                            value={passed}
                            onValueChange={(val) => {
                                console.log(val)
                                setPassed(val)
                                // UPDATE STATE 
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
                )}

                {/* DOB */}
                <Field>
                    FieldLabel
                </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet>
                <FieldLegend>Billing Address</FieldLegend>
                <FieldDescription>
                The billing address associated with your payment method
                </FieldDescription>
                <FieldGroup>
                <Field orientation="horizontal">
                    <Checkbox
                    id="checkout-7j9-same-as-shipping-wgm"
                    defaultChecked
                    />
                    <FieldLabel
                    htmlFor="checkout-7j9-same-as-shipping-wgm"
                    className="font-normal"
                    >
                    Same as shipping address
                    </FieldLabel>
                </Field>
                </FieldGroup>
            </FieldSet>
            </FieldGroup>
        </div>
    )
}