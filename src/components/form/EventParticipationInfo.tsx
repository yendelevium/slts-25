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
              {formData.group === "1" && (
                <>
                {/* Devotional Singing Field (Group Event) */}
                <Field>
                  <FieldLabel>
                    Do you want to participate in Devotional Singing (Group Event)? *
                  </FieldLabel>

                  <RadioGroup 
                    value={formData.devotionalSinging}
                    onValueChange={(val) => {
                        console.log(val)
                        // If group event is chosen, only 1 other individual event is allowed
                        // So, I am resetting the state of individualChoice2 whenever devotional singing is set to yes
                        if (val === "yes") {
                          updateForm({ devotionalSinging: val, individualChoice2: "" })
                        } else {
                          updateForm({ devotionalSinging: val })
                        }
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
                
                {/* Individual Event Choice 1 Field*/}
                <Field>
                  <FieldLabel>
                    Please select the Individual Event you would like to participate in: *
                  </FieldLabel>

                  <RadioGroup 
                    value={formData.individualChoice1}
                    onValueChange={(val) => {
                        console.log(val)
                        updateForm({ individualChoice1: val })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="bhajans" id="bhajans-choice1" />
                      <Label htmlFor="bhajans-choice1">Bhajans</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="slokas" id="slokas-choice1" />
                      <Label htmlFor="slokas-choice1">Slokas</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="vedam-chanting" id="vedam-chanting-choice1" />
                      <Label htmlFor="vedam-chanting-choice1">Vedam Chanting</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="story-telling-english" id="story-telling-english-choice1" />
                      <Label htmlFor="story-telling-english-choice1">Story Telling (English)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="story-telling-tamizh" id="story-telling-tamizh-choice1" />
                      <Label htmlFor="story-telling-tamizh-choice1">Story Telling (Tamizh)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="drawing" id="drawing-choice1" />
                      <Label htmlFor="drawing-choice1">Drawing</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="tamizh-chants" id="tamizh-chants-choice1" />
                      <Label htmlFor="tamizh-chants-choice1">Tamizh Chants</Label>
                    </div>
                  </RadioGroup>
                </Field>

                {/* Individual Event Choice 2 Field (shown only if participant doesn't participate in Devotional Singing)*/}
                {formData.devotionalSinging === "no" && (
                  <Field>
                    <FieldLabel>
                      Please select the 2nd Individual Event you would like to participate in: *
                    </FieldLabel>

                    <RadioGroup 
                      value={formData.individualChoice2}
                      onValueChange={(val) => {
                          console.log(val)
                          updateForm({ individualChoice2: val })
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="bhajans" id="bhajans-choice2" />
                        <Label htmlFor="bhajans-choice2">Bhajans</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="slokas" id="slokas-choice2" />
                        <Label htmlFor="slokas-choice2">Slokas</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="vedam-chanting" id="vedam-chanting-choice2" />
                        <Label htmlFor="vedam-chanting-choice2">Vedam Chanting</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="story-telling-english" id="story-telling-english-choice2" />
                        <Label htmlFor="story-telling-english-choice2">Story Telling (English)</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="story-telling-tamizh" id="story-telling-tamizh-choice2" />
                        <Label htmlFor="story-telling-tamizh-choice2">Story Telling (Tamizh)</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="drawing" id="drawing-choice2" />
                        <Label htmlFor="drawing-choice2">Drawing</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="tamizh-chants" id="tamizh-chants-choice2" />
                        <Label htmlFor="tamizh-chants-choice2">Tamizh Chants</Label>
                      </div>
                    </RadioGroup>
                  </Field>
                )}
                </>
              )}

              {(formData.group === "2" || formData.group === "3") && (
                <>
                <Field>
                  <FieldLabel>
                    Do you want to participate in Quiz or Drawing? *
                  </FieldLabel>

                  <RadioGroup 
                    value={formData.participateInQuizDrawing}
                    onValueChange={(val) => {
                        console.log(val)
                        // If quiz/drawing event is chosen, then no group event can be chosen
                        // So, I am setting the state of participateInGroupEvent to none when the choose neither
                        if (val === "quiz" || val === "drawing") {
                          updateForm({ participateInQuizDrawing: val, participateInGroupEvent: "none" })
                        } else {
                          updateForm({ participateInQuizDrawing: val, participateInGroupEvent: "" })
                        }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="quiz" id="quiz-participate" />
                      <Label htmlFor="quiz-participate">Quiz</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="drawing" id="drawing-participate" />
                      <Label htmlFor="drawing-participate">Drawing</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="none" id="none-participate" />
                      <Label htmlFor="none-participate">I don't want to participate in Quiz or Drawing</Label>
                    </div>
                  </RadioGroup>
                </Field>

                {formData.participateInQuizDrawing === "none" && (
                  <Field>
                  <FieldLabel>
                    Please select the Group Event you would like to participate in: *
                  </FieldLabel>

                  <RadioGroup 
                    value={formData.participateInGroupEvent}
                    onValueChange={(val) => {
                        console.log(val)
                        // If group event is chosen, only 1 other individual event is allowed
                        // So, I am resetting the state of individualChoice2 whenever a group event is chosen
                        if (val !== "none") {
                          updateForm({ participateInGroupEvent: val, individualChoice2: "" })
                        } else {
                          updateForm({ participateInGroupEvent: val })
                        }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="altar-decoration" id="altar-decoration-participate" />
                      <Label htmlFor="altar-decoration-participate">Altar Decoration</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="rudram-namakam-chanting" id="rudram-namakam-chanting-participate" />
                      <Label htmlFor="rudram-namakam-chanting-participate">Rudram Namakam Chanting</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="devotional-singing" id="devotional-singing-participate" />
                      <Label htmlFor="devotional-singing-participate">Devotional Singing</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="none" id="none-participate" />
                      <Label htmlFor="none-participate">I don't want to participate in Group Event</Label>
                    </div>
                  </RadioGroup>
                </Field>
                )}

                <Field>
                  <FieldLabel>
                    Please select the Individual Event you would like to participate in: *
                  </FieldLabel>

                  <RadioGroup 
                    value={formData.individualChoice1}
                    onValueChange={(val) => {
                        console.log(val)
                        updateForm({ individualChoice1: val })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="bhajans" id="bhajans-choice1" />
                      <Label htmlFor="bhajans-choice1">Bhajans</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="slokas" id="slokas-choice1" />
                      <Label htmlFor="slokas-choice1">Slokas</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="vedam-chanting" id="vedam-chanting-choice1" />
                      <Label htmlFor="vedam-chanting-choice1">Vedam Chanting</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="story-telling-english" id="story-telling-english-choice1" />
                      <Label htmlFor="story-telling-english-choice1">Story Telling (English)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="story-telling-tamizh" id="story-telling-tamizh-choice1" />
                      <Label htmlFor="story-telling-tamizh-choice1">Story Telling (Tamizh)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="elocution-english" id="elocution-english-choice1" />
                      <Label htmlFor="elocution-english-choice1">Elocution (English)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="elocution-tamizh" id="elocution-tamizh-choice1" />
                      <Label htmlFor="elocution-tamizh-choice1">Elocution (Tamizh)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="tamizh-chants" id="tamizh-chants-choice1" />
                      <Label htmlFor="tamizh-chants-choice1">Tamizh Chants</Label>
                    </div>
                  </RadioGroup>
                </Field>

                {formData.participateInQuizDrawing === "none" && formData.participateInGroupEvent === "none" && (
                  <Field>
                    <FieldLabel>
                      Please select the 2nd Individual Event you would like to participate in: *
                    </FieldLabel>

                    <RadioGroup 
                      value={formData.individualChoice2}
                      onValueChange={(val) => {
                          console.log(val)
                          updateForm({ individualChoice2: val })
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="bhajans" id="bhajans-choice2" />
                        <Label htmlFor="bhajans-choice2">Bhajans</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="slokas" id="slokas-choice2" />
                        <Label htmlFor="slokas-choice2">Slokas</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="vedam-chanting" id="vedam-chanting-choice2" />
                        <Label htmlFor="vedam-chanting-choice2">Vedam Chanting</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="story-telling-english" id="story-telling-english-choice2" />
                        <Label htmlFor="story-telling-english-choice2">Story Telling (English)</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="story-telling-tamizh" id="story-telling-tamizh-choice2" />
                        <Label htmlFor="story-telling-tamizh-choice2">Story Telling (Tamizh)</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="elocution-english" id="elocution-english-choice2" />
                        <Label htmlFor="elocution-english-choice2">Elocution (English)</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="elocution-tamizh" id="elocution-tamizh-choice2" />
                        <Label htmlFor="elocution-tamizh-choice2">Elocution (Tamizh)</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="tamizh-chants" id="tamizh-chants-choice2" />
                        <Label htmlFor="tamizh-chants-choice2">Tamizh Chants</Label>
                      </div>
                    </RadioGroup>
                  </Field>
                )}
                </>
              )}
            </FieldGroup>

        </FieldSet>
      </FieldGroup>
    </div>
  )
}
