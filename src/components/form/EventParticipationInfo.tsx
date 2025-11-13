import {
  FieldGroup,
  FieldDescription,
  FieldLegend,
  FieldSet,
  Field,
  FieldLabel,
} from "../ui/field";
import { useFormStore } from "@/store/formStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function EventParticipationInfo() {
  const { formData, updateForm } = useFormStore();

  return (
    <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Event Participation</FieldLegend>
          <FieldDescription>
            Please enter the CORRECT information about the events you would like
            to participate in.
          </FieldDescription>

          <FieldGroup>
            {/* Event Participation Info for Group 1 Participants */}
            {formData.group === "1" && (
              <>
                {/* Devotional Singing Field (Group Event) */}
                <Field>
                  <FieldLabel>
                    Do you want to participate in Devotional Singing (Group
                    Event)? *
                  </FieldLabel>

                  <RadioGroup
                    value={formData.devotionalSinging.toString()}
                    onValueChange={(val) => {
                      console.log(val);
                      // If group event is chosen, only 1 other individual event is allowed
                      // So, I am resetting the state of individualChoice2 whenever devotional singing is set to yes
                      if (val === "yes") {
                        updateForm({
                          devotionalSinging: val,
                          individualChoice2: "",
                        });
                      } else {
                        updateForm({ devotionalSinging: val });
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
                    Please select the Individual Event you would like to
                    participate in: *
                  </FieldLabel>

                  <RadioGroup
                    value={formData.individualChoice1.toString()}
                    onValueChange={(val) => {
                      if (val === "bhajans" || val === "tamizh-chants") {
                        toast.error(
                          "Bhajans and Tamizh Chants can't be chosen together. The other option has been cleared automatically.",
                        );
                      }
                      console.log(val);
                      if (
                        (val === "bhajans" &&
                          formData.individualChoice2 === "tamizh-chants") ||
                        (val === "tamizh-chants" &&
                          formData.individualChoice2 === "bhajans")
                      ) {
                        updateForm({
                          individualChoice1: val,
                          individualChoice2: "",
                        });
                      } else {
                        updateForm({ individualChoice1: val });
                      }
                    }}
                  >
                    {formData.individualChoice2 !== "tamizh-chants" &&
                      formData.individualChoice2 !== "bhajans" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="bhajans"
                            id="bhajans-choice1"
                          />
                          <Label htmlFor="bhajans-choice1">Bhajans</Label>
                        </div>
                      )}
                    {formData.individualChoice2 !== "slokas" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="slokas" id="slokas-choice1" />
                        <Label htmlFor="slokas-choice1">Slokas</Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "vedam-chanting" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="vedam-chanting"
                          id="vedam-chanting-choice1"
                        />
                        <Label htmlFor="vedam-chanting-choice1">
                          Vedam Chanting
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "story-telling-english" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="story-telling-english"
                          id="story-telling-english-choice1"
                        />
                        <Label htmlFor="story-telling-english-choice1">
                          Story Telling (English)
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "story-telling-tamizh" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="story-telling-tamizh"
                          id="story-telling-tamizh-choice1"
                        />
                        <Label htmlFor="story-telling-tamizh-choice1">
                          Story Telling (Tamizh)
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "drawing" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="drawing" id="drawing-choice1" />
                        <Label htmlFor="drawing-choice1">Drawing</Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "bhajans" &&
                      formData.individualChoice2 !== "tamizh-chants" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="tamizh-chants"
                            id="tamizh-chants-choice1"
                          />
                          <Label htmlFor="tamizh-chants-choice1">
                            Tamizh Chants
                          </Label>
                        </div>
                      )}
                  </RadioGroup>
                </Field>

                {/* Individual Event Choice 2 Field (shown only if participant doesn't participate in Devotional Singing)*/}
                {formData.devotionalSinging === "no" && (
                  <Field>
                    <FieldLabel>
                      Please select the 2nd Individual Event you would like to
                      participate in:
                    </FieldLabel>

                    <RadioGroup
                      value={formData.individualChoice2.toString()}
                      onValueChange={(val) => {
                        if (val === "bhajans" || val === "tamizh-chants") {
                          toast.error(
                            "You can only choose one of Bhajans or Tamizh Chants. The other option has been cleared automatically.",
                          );
                        }
                        console.log(val);
                        if (
                          (val === "bhajans" &&
                            formData.individualChoice1 === "tamizh-chants") ||
                          (val === "tamizh-chants" &&
                            formData.individualChoice1 === "bhajans")
                        ) {
                          updateForm({
                            individualChoice2: val,
                            individualChoice1: "",
                          });
                        } else {
                          updateForm({ individualChoice2: val });
                        }
                      }}
                    >
                      {formData.individualChoice1 !== "tamizh-chants" &&
                        formData.individualChoice1 !== "bhajans" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="bhajans"
                              id="bhajans-choice2"
                            />
                            <Label htmlFor="bhajans-choice2">Bhajans</Label>
                          </div>
                        )}
                      {formData.individualChoice1 !== "slokas" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="slokas" id="slokas-choice2" />
                          <Label htmlFor="slokas-choice2">Slokas</Label>
                        </div>
                      )}
                      {formData.individualChoice1 !== "vedam-chanting" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="vedam-chanting"
                            id="vedam-chanting-choice2"
                          />
                          <Label htmlFor="vedam-chanting-choice2">
                            Vedam Chanting
                          </Label>
                        </div>
                      )}
                      {formData.individualChoice1 !==
                        "story-telling-english" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="story-telling-english"
                            id="story-telling-english-choice2"
                          />
                          <Label htmlFor="story-telling-english-choice2">
                            Story Telling (English)
                          </Label>
                        </div>
                      )}
                      {formData.individualChoice1 !==
                        "story-telling-tamizh" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="story-telling-tamizh"
                            id="story-telling-tamizh-choice2"
                          />
                          <Label htmlFor="story-telling-tamizh-choice2">
                            Story Telling (Tamizh)
                          </Label>
                        </div>
                      )}
                      {formData.individualChoice1 !== "drawing" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="drawing"
                            id="drawing-choice2"
                          />
                          <Label htmlFor="drawing-choice2">Drawing</Label>
                        </div>
                      )}
                      {formData.individualChoice1 !== "bhajans" &&
                        formData.individualChoice1 !== "tamizh-chants" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="tamizh-chants"
                              id="tamizh-chants-choice2"
                            />
                            <Label htmlFor="tamizh-chants-choice2">
                              Tamizh Chants
                            </Label>
                          </div>
                        )}
                    </RadioGroup>
                  </Field>
                )}
              </>
            )}

            {/* Event Participation Info for Group 2 or 3 Participants */}
            {(formData.group === "2" || formData.group === "3") && (
              <>
                {/* Quiz or Drawing Participation Field */}
                <Field>
                  <FieldLabel>
                    Do you want to participate in Quiz or Drawing? *
                  </FieldLabel>

                  <RadioGroup
                    value={formData.participateInQuizDrawing.toString()}
                    onValueChange={(val) => {
                      console.log(val);
                      // If quiz/drawing event is chosen, then no group event can be chosen and only 1 other individual event can be chosen
                      // So, I am resetting the state of participateInGroupEvent and individualChoice2
                      if (val === "quiz" || val === "drawing") {
                        updateForm({
                          participateInQuizDrawing: val,
                          participateInGroupEvent: "",
                          individualChoice2: "",
                        });
                      } else {
                        updateForm({ participateInQuizDrawing: val });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="quiz" id="quiz-participate" />
                      <Label htmlFor="quiz-participate">Quiz</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="drawing"
                        id="drawing-participate"
                      />
                      <Label htmlFor="drawing-participate">Drawing</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="none" id="none-participate" />
                      <Label htmlFor="none-participate">
                        I don't want to participate in Quiz or Drawing
                      </Label>
                    </div>
                  </RadioGroup>
                </Field>

                {/* Group Event Field (shown only if participant doesn't participate in quiz/drawing as grp events not allowed with quiz/drawing)*/}
                {formData.participateInQuizDrawing === "none" && (
                  <Field>
                    <FieldLabel>
                      Please select the Group Event you would like to
                      participate in: *
                    </FieldLabel>

                    <RadioGroup
                      value={formData.participateInGroupEvent.toString()}
                      onValueChange={(val) => {
                        console.log(val);
                        // If group event is chosen, only 1 other individual event is allowed
                        // So, I am resetting the state of individualChoice2 whenever a group event is chosen
                        if (val !== "none") {
                          updateForm({
                            participateInGroupEvent: val,
                            individualChoice2: "",
                          });
                        } else {
                          updateForm({ participateInGroupEvent: val });
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="altar-decoration"
                          id="altar-decoration-participate"
                        />
                        <Label htmlFor="altar-decoration-participate">
                          Altar Decoration
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="rudram-namakam-chanting"
                          id="rudram-namakam-chanting-participate"
                        />
                        <Label htmlFor="rudram-namakam-chanting-participate">
                          Rudram Namakam Chanting
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="devotional-singing"
                          id="devotional-singing-participate"
                        />
                        <Label htmlFor="devotional-singing-participate">
                          Devotional Singing
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="none" id="none-participate" />
                        <Label htmlFor="none-participate">
                          I don't want to participate in Group Event
                        </Label>
                      </div>
                    </RadioGroup>
                  </Field>
                )}

                {/* Individual Event Choice 1 Field*/}
                <Field>
                  <FieldLabel>
                    Please select the Individual Event you would like to
                    participate in: *
                  </FieldLabel>

                  <RadioGroup
                    value={formData.individualChoice1.toString()}
                    onValueChange={(val) => {
                      console.log(val);
                      if (val === "bhajans" || val === "tamizh-chants") {
                        toast.error(
                          "You can only choose one of Bhajans or Tamizh Chants. The other option has been cleared automatically.",
                        );
                      }
                      if (
                        (val === "bhajans" &&
                          formData.individualChoice2 === "tamizh-chants") ||
                        (val === "tamizh-chants" &&
                          formData.individualChoice2 === "bhajans")
                      ) {
                        updateForm({
                          individualChoice1: val,
                          individualChoice2: "",
                        });
                      } else {
                        updateForm({ individualChoice1: val });
                      }
                    }}
                  >
                    {formData.individualChoice2 !== "tamizh-chants" &&
                      formData.individualChoice2 !== "bhajans" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="bhajans"
                            id="bhajans-choice1"
                          />
                          <Label htmlFor="bhajans-choice1">Bhajans</Label>
                        </div>
                      )}
                    {formData.individualChoice2 !== "slokas" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="slokas" id="slokas-choice1" />
                        <Label htmlFor="slokas-choice1">Slokas</Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "vedam-chanting" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="vedam-chanting"
                          id="vedam-chanting-choice1"
                        />
                        <Label htmlFor="vedam-chanting-choice1">
                          Vedam Chanting
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "story-telling-english" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="story-telling-english"
                          id="story-telling-english-choice1"
                        />
                        <Label htmlFor="story-telling-english-choice1">
                          Story Telling (English)
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "story-telling-tamizh" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="story-telling-tamizh"
                          id="story-telling-tamizh-choice1"
                        />
                        <Label htmlFor="story-telling-tamizh-choice1">
                          Story Telling (Tamizh)
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "elocution-english" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="elocution-english"
                          id="elocution-english-choice1"
                        />
                        <Label htmlFor="elocution-english-choice1">
                          Elocution (English)
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "elocution-tamizh" && (
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="elocution-tamizh"
                          id="elocution-tamizh-choice1"
                        />
                        <Label htmlFor="elocution-tamizh-choice1">
                          Elocution (Tamizh)
                        </Label>
                      </div>
                    )}
                    {formData.individualChoice2 !== "bhajans" &&
                      formData.individualChoice2 !== "tamizh-chants" && (
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="tamizh-chants"
                            id="tamizh-chants-choice1"
                          />
                          <Label htmlFor="tamizh-chants-choice1">
                            Tamizh Chants
                          </Label>
                        </div>
                      )}
                  </RadioGroup>
                </Field>

                {/* Individual Event Choice 2 Field (shown only if participant doesn't participate in quiz/drawing and grp events)*/}
                {formData.participateInQuizDrawing === "none" &&
                  formData.participateInGroupEvent === "none" && (
                    <Field>
                      <FieldLabel>
                        Please select the 2nd Individual Event you would like to
                        participate in:
                      </FieldLabel>

                      <RadioGroup
                        value={formData.individualChoice2.toString()}
                        onValueChange={(val) => {
                          console.log(val);
                          if (val === "bhajans" || val === "tamizh-chants") {
                            toast.error(
                              "You can only choose one of Bhajans or Tamizh Chants. The other option has been cleared automatically.",
                            );
                          }
                          if (
                            (val === "bhajans" &&
                              formData.individualChoice1 === "tamizh-chants") ||
                            (val === "tamizh-chants" &&
                              formData.individualChoice1 === "bhajans")
                          ) {
                            updateForm({
                              individualChoice2: val,
                              individualChoice1: "",
                            });
                          } else {
                            updateForm({ individualChoice2: val });
                          }
                        }}
                      >
                        {formData.individualChoice1 !== "tamizh-chants" &&
                          formData.individualChoice1 !== "bhajans" && (
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="bhajans"
                                id="bhajans-choice2"
                              />
                              <Label htmlFor="bhajans-choice2">Bhajans</Label>
                            </div>
                          )}
                        {formData.individualChoice1 !== "slokas" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="slokas"
                              id="slokas-choice2"
                            />
                            <Label htmlFor="slokas-choice2">Slokas</Label>
                          </div>
                        )}
                        {formData.individualChoice1 !== "vedam-chanting" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="vedam-chanting"
                              id="vedam-chanting-choice2"
                            />
                            <Label htmlFor="vedam-chanting-choice2">
                              Vedam Chanting
                            </Label>
                          </div>
                        )}
                        {formData.individualChoice1 !==
                          "story-telling-english" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="story-telling-english"
                              id="story-telling-english-choice2"
                            />
                            <Label htmlFor="story-telling-english-choice2">
                              Story Telling (English)
                            </Label>
                          </div>
                        )}
                        {formData.individualChoice1 !==
                          "story-telling-tamizh" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="story-telling-tamizh"
                              id="story-telling-tamizh-choice2"
                            />
                            <Label htmlFor="story-telling-tamizh-choice2">
                              Story Telling (Tamizh)
                            </Label>
                          </div>
                        )}
                        {formData.individualChoice1 !== "elocution-english" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="elocution-english"
                              id="elocution-english-choice2"
                            />
                            <Label htmlFor="elocution-english-choice2">
                              Elocution (English)
                            </Label>
                          </div>
                        )}
                        {formData.individualChoice1 !== "elocution-tamizh" && (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="elocution-tamizh"
                              id="elocution-tamizh-choice2"
                            />
                            <Label htmlFor="elocution-tamizh-choice2">
                              Elocution (Tamizh)
                            </Label>
                          </div>
                        )}
                        {formData.individualChoice1 !== "bhajans" &&
                          formData.individualChoice1 !== "tamizh-chants" && (
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="tamizh-chants"
                                id="tamizh-chants-choice2"
                              />
                              <Label htmlFor="tamizh-chants-choice2">
                                Tamizh Chants
                              </Label>
                            </div>
                          )}
                      </RadioGroup>
                    </Field>
                  )}
              </>
            )}

            {/* Event Participation Info for Group 4 Participants */}
            {formData.group === "4" && (
              <>
                {/* Quiz Participation Field*/}
                <Field>
                  <FieldLabel>Do you want to participate in Quiz? *</FieldLabel>

                  <RadioGroup
                    value={formData.participateInQuizDrawing.toString()}
                    onValueChange={(val) => {
                      console.log(val);
                      updateForm({ participateInQuizDrawing: val });
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="quiz" id="quiz-participate" />
                      <Label htmlFor="quiz-participate">Yes</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="none" id="none-participate" />
                      <Label htmlFor="none-participate">No</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </>
            )}
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
      <Toaster />
    </div>
  );
}
