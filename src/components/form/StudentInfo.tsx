
import { Button } from "@/components/ui/button"
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
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useFormStore } from "@/store/formStore"
import debouncedUpdate from "@/utils/debounce"

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
    const { formData, updateForm } = useFormStore()

    // Defining it ONCE as a debounced function to update the form
    // But will need to repeat for all components as store is only accessible in functional components
    const debouncedFormUpdate = debouncedUpdate((key: string, value: string) => {
        updateForm({ [key]: value })
    })

    // DOB state
    const [open, setOpen] = useState(false)
    const [openJoin, setOpenJoin] = useState(false)
    
    const groupElementsJSX = ["1", "2", "3", "4"].map(group => {
        return(
            <Button
            key={group}
            onClick={()=>{
                updateForm({ group: group })
                console.log(formData)
                // Setting `passed` to null if the group isn't group 3??
                // Or should I keep it as the previous value?                
                if(group!="3"){
                    updateForm({ hasGivenGroup2Exam: "" })
                }

            }}
            variant="outline"
            // I'm using a simple logic to show which button was selected
            // Using ! for the selected style as shadCN hower continues to be on when i select making it look bad
            // Maybe it won't be an issue in phone, but it sure is in a PC
            className={
                `flex items-center gap-2 cursor-pointer font-normal 
                ${formData.group === group ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`
            }
            >
            Group {group}
            </Button>
        )
    });

    const genderElementsJSX = ["Male", "Female", "Other"].map(gender => {
        return(
            <Button
            key={gender}
            onClick={()=>{
                // TODO: Update store to set the chosen gender...
                updateForm({ gender: gender })
            }}
            variant="outline"
            // size="lg"
            className={
                `flex items-center gap-2 cursor-pointer font-normal 
                ${formData.gender === gender ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`
            }
            >
            {gender}
            </Button>
        )
    });

    const districtElementsJSX = districts.map((district) => (
    <SelectItem key={district} value={district}>
        {district}
    </SelectItem>
    ));


    return (
        <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
            <FieldGroup>
            <FieldSet>
                <FieldLegend>Student Information</FieldLegend>
                <FieldDescription>
                Please enter the CORRECT information about the participation
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
                {formData.group  == "3" && (
                    <Field>
                        <FieldLabel htmlFor="passed-grp2-exam">
                        Passed Group 2 Exam? *
                        </FieldLabel>

                        <RadioGroup 
                            value={formData.hasGivenGroup2Exam}
                            onValueChange={(val) => {
                                console.log(val)
                                updateForm({ hasGivenGroup2Exam: val })
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
                    <FieldLabel htmlFor="dob">
                        Date of Birth *
                    </FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                        >
                            {formData.dob ? formData.dob.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                        </PopoverTrigger>
                        
                        {/* TODO: Make the pop-over calendart the same length as the button and center it */}
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={formData.dob}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                updateForm({ dob: date })
                                setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </Field>

                {/* Name */}
                {/* MAKE SURE UR defaultValue IS EQUAL TO THE STORE FOR INPUT FIELDS, NOT DIRECTLY `value` AS THAT WILL CAUSE LOT OF LAG */}
                <Field>
                    <FieldLabel htmlFor="name">
                        Name *
                    </FieldLabel>
                    <Input type="text" placeholder="Yash" id="name" defaultValue={formData.name} onChange={(e)=> debouncedFormUpdate("name", e.target.value)}/>
                </Field>
                
                {/* Gender */}
                <Field>
                    <FieldLabel htmlFor="gender">
                        Gender *
                    </FieldLabel>
                        <div className="flex flex-wrap gap-3">
                            {genderElementsJSX}
                        </div>
                </Field>

                {/* District */}
                <Field>
                    <FieldLabel htmlFor="district">
                        District *
                    </FieldLabel>
                    <Select value={formData.district} onValueChange={(val) => updateForm({ district: val })}>
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
                    <FieldLabel htmlFor="samithi">
                        Samithi *
                    </FieldLabel>
                    <Input type="text" placeholder="idk" id="samithi" defaultValue={formData.samithi} onChange={(e)=> debouncedFormUpdate("samithi", e.target.value)} />
                </Field>

                {/* Couldn't find a year only dropdown in SHADCN, might just make it a select button later? */}
                <Field>
                    <FieldLabel htmlFor="year-bv">
                        Student's Year of Joining Balvikas*
                    </FieldLabel>
                    <Input type="number" placeholder="2019" id="year-bv" defaultValue={formData.yearOfJoining} min={2000} max={2025} onChange={(e)=> debouncedFormUpdate("yearOfJoining", e.target.value)} />
                </Field>

                {/* Date of Joining Balvikas */}
                <Field>
                    <FieldLabel htmlFor="date-bv">
                        Date of Joining Balvikas (Optional)
                    </FieldLabel>
                    <Popover open={openJoin} onOpenChange={setOpenJoin}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                        >
                            {formData.dateOfJoining ? formData.dateOfJoining.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                        </PopoverTrigger>
                        
                        {/* TODO: Make the pop-over calendart the same length as the button and center it */}
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start" >
                            <Calendar
                                mode="single"
                                selected={formData.dateOfJoining}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                updateForm({ dateOfJoining: date })
                                setOpenJoin(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </Field>
                
                {/* Food Allergies */}
                <Field>
                    <FieldLabel htmlFor="allergy">
                        Food Allergies (Optional)
                    </FieldLabel>
                    <Input type="text" placeholder="peanuts, gluten" defaultValue={formData.foodAllergies} onChange={(e)=> debouncedFormUpdate("foodAllergies", e.target.value)} id="allergy"/>
                </Field>

                </FieldGroup>
            </FieldSet>
            </FieldGroup>
        </div>
    )
}