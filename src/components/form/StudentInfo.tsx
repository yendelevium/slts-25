
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

export default function StudentInfo() {
    // TODO: Replace these states with the TanStack store later when I actually write the store lol
    // The states for which group the student is in, and whether he has passed the group 2 exam or not (only if grp 3 is selected)
    const [activeGroup, setActiveGroup] = useState<string | null>(null)
    const [activeGender, setActiveGender] = useState<string | null>(null)
    const [passed, setPassed] = useState<string | null>(null)

    // DOB state
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)

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

    const genderElementsJSX = ["Male", "Female", "Other"].map(gender => {
        return(
            <Button
            key={gender}
            onClick={()=>{
                // TODO: Update store to set the chosen gender...
                setActiveGender(gender)
            }}
            variant="outline"
            // size="lg"
            className={
                `flex items-center gap-2 cursor-pointer font-normal 
                ${activeGender === gender ? "!bg-indigo-500 !text-white !border-indigo-500" : ""}`
            }
            >
            {gender}
            </Button>
        )
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
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                        </PopoverTrigger>
                        
                        {/* TODO: Make the pop-over calendart the same length as the button and center it */}
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                setDate(date)
                                setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </Field>


                {/* TODO: DO THE STATE SETTING FOR ALL OF THESE GUYS... */}
                <Field>
                    <FieldLabel htmlFor="name">
                        Name *
                    </FieldLabel>
                    <Input type="text" placeholder="Yash" id="name"/>
                </Field>
                
                <Field>
                    <FieldLabel htmlFor="gender">
                        Gender *
                    </FieldLabel>
                        <div className="flex flex-wrap gap-3">
                            {genderElementsJSX}
                        </div>
                </Field>

                <Field>
                    <FieldLabel htmlFor="district">
                        District *
                    </FieldLabel>
                    <Select>
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

                <Field>
                    <FieldLabel htmlFor="samithi">
                        Samithi *
                    </FieldLabel>
                    <Input type="text" placeholder="idk" id="samithi"/>
                </Field>
                

                {/* Couldn't find a year only dropdown in SHADCN, might just make it a select button later? */}
                <Field>
                    <FieldLabel htmlFor="year-bv">
                        Student's Year of Joining Balvikas*
                    </FieldLabel>
                    <Input type="number" placeholder="2019" id="year-bv" min={2000} max={2025}/>
                </Field>

                {/* Change this to be customized for balvikas date, not the same as DOB */}
                <Field>
                    <FieldLabel htmlFor="date-bv">
                        Date of Joining Balvikas (Optional)
                    </FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-[var(--radix-popover-trigger-width)] justify-between font-normal"
                        >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                        </PopoverTrigger>
                        
                        {/* TODO: Make the pop-over calendart the same length as the button and center it */}
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                            />
                        </PopoverContent>
                    </Popover>
                </Field>

                <Field>
                    <FieldLabel htmlFor="allergy">
                        Food Allergies (Optional)
                    </FieldLabel>
                    <Input type="text" placeholder="peanuts, gluten" id="allergy"/>
                </Field>


                </FieldGroup>
            </FieldSet>
            </FieldGroup>
        </div>
    )
}