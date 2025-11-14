import {
  FieldGroup,
  FieldDescription,
  FieldLegend,
  FieldSet,
  Field,
  FieldLabel,
} from "../ui/field";
import { type FormData, useFormStore } from "@/store/formStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";

export const EventsSchema = z
  .object({
    group: z.string().min(1),
    devotionalSinging: z.string(),
    individualChoice1: z.string(),
    individualChoice2: z.string(),
    participateInQuizDrawing: z.string(),
    participateInGroupEvent: z.string(),
  })
  .refine((data) => {
    // Group 1 validation
    if (data.group === "1") {
      return (
        (data.devotionalSinging == "yes" &&
          data.individualChoice1.length > 0) ||
        data.devotionalSinging == "yes" ||
        data.individualChoice1.length > 0 ||
        (data.individualChoice1.length > 0 && data.individualChoice2.length > 0)
      );
    }

    // Group 2 or 3 validation
    if (data.group === "2" || data.group === "3") {
      if (data.participateInQuizDrawing.length === 0) return false;

      if (data.participateInQuizDrawing === "none") {
        if (data.participateInGroupEvent.length === 0) return false;
        if (
          data.participateInGroupEvent === "none" &&
          data.individualChoice1.length === 0
        ) {
          return false;
        }
      }

      // Participating in more than 2 events
      if (
        (data.participateInQuizDrawing === "quiz" ||
          data.participateInQuizDrawing === "drawing") &&
        data.individualChoice1.length === 1 &&
        data.individualChoice2.length === 1
      ) {
        return false;
      }
      return true;
    }

    // Group 4 validation
    if (data.group === "4") {
      return data.participateInQuizDrawing.length > 0;
    }
    return true;
  });

export default function EventParticipationInfo() {
  const { formData, updateForm } = useFormStore();

  const checkRequired = (data: FormData) => {
    const parsed = EventsSchema.safeParse(data);

    const isSection2Valid = parsed.success;

    const newArr = [...data.nextSectionEnable];
    newArr[data.sectionNumber] = isSection2Valid;
    if (isSection2Valid) {
      updateForm({ nextSectionEnable: newArr, showErrors: false });
    } else {
      updateForm({ nextSectionEnable: newArr });
    }
  };

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
                  {formData.showErrors && formData.devotionalSinging == "" && (
                    <div className="text-red-600 text-sm">
                      Please indicate whether you want to participate in
                      Devotional Singing
                    </div>
                  )}
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
                        const updated = {
                          ...formData,
                          devotionalSinging: val,
                          individualChoice2: "",
                        };
                        updateForm({
                          devotionalSinging: val,
                          individualChoice2: "",
                        });
                        checkRequired(updated);
                      } else {
                        const updated = {
                          ...formData,
                          devotionalSinging: val,
                        };
                        updateForm({ devotionalSinging: val });
                        checkRequired(updated);
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
                {formData.devotionalSinging && (
                  <Field>
                    {formData.showErrors &&
                      formData.devotionalSinging == "no" &&
                      formData.individualChoice1 == "" && (
                        <div className="text-red-600 text-sm">
                          You have to choose atleast 1 indiviual event
                        </div>
                      )}
                    <FieldLabel>
                      Please select the Individual Event you would like to
                      participate in:{" "}
                      {formData.devotionalSinging === "no" ? "*" : "(Optional)"}
                    </FieldLabel>
                    <RadioGroup
                      value={formData.individualChoice1.toString()}
                      onValueChange={(val) => {
                        if (
                          (val === "bhajans" || val === "tamizh-chants") &&
                          formData.devotionalSinging === "no"
                        ) {
                          toast.error(
                            "Bhajans and Tamizh Chants can't be chosen together. The other option has been cleared automatically.",
                            {
                              action: {
                                label: "Close",
                                onClick: () => {},
                              },
                            },
                          );
                        }
                        console.log(val);
                        if (
                          (val === "bhajans" &&
                            formData.individualChoice2 === "tamizh-chants") ||
                          (val === "tamizh-chants" &&
                            formData.individualChoice2 === "bhajans")
                        ) {
                          const updated = {
                            ...formData,
                            individualChoice1: val,
                            individualChoice2: "",
                          };
                          updateForm({
                            individualChoice1: val,
                            individualChoice2: "",
                          });
                          checkRequired(updated);
                        } else {
                          const updated = {
                            ...formData,
                            individualChoice1: val,
                          };
                          updateForm({ individualChoice1: val });
                          checkRequired(updated);
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
                      {formData.individualChoice2 !==
                        "story-telling-english" && (
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
                      {formData.individualChoice2 !==
                        "story-telling-tamizh" && (
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
                          <RadioGroupItem
                            value="drawing"
                            id="drawing-choice1"
                          />
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
                    <FieldLabel>
                      {formData.devotionalSinging == "yes" && (
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            updateForm({ individualChoice1: "" });
                            checkRequired({
                              ...formData,
                              individualChoice1: "",
                            });
                          }}
                          size="sm"
                        >
                          Clear Selection for Individual Event 1
                        </Button>
                      )}
                    </FieldLabel>
                  </Field>
                )}

                {/* Individual Event Choice 2 Field (shown only if participant doesn't participate in Devotional Singing)*/}
                {formData.devotionalSinging === "no" &&
                  formData.individualChoice1 && (
                    <Field>
                      <FieldLabel>
                        Please select the 2nd Individual Event you would like to
                        participate in: (Optional)
                      </FieldLabel>

                      <RadioGroup
                        value={formData.individualChoice2.toString()}
                        onValueChange={(val) => {
                          if (val === "bhajans" || val === "tamizh-chants") {
                            toast.error(
                              "Bhajans and Tamizh Chants can't be chosen together. The other option has been cleared automatically.",
                              {
                                action: {
                                  label: "Close",
                                  onClick: () => {},
                                },
                              },
                            );
                          }
                          console.log(val);
                          if (
                            (val === "bhajans" &&
                              formData.individualChoice1 === "tamizh-chants") ||
                            (val === "tamizh-chants" &&
                              formData.individualChoice1 === "bhajans")
                          ) {
                            const updated = {
                              ...formData,
                              individualChoice2: val,
                              individualChoice1: "",
                            };
                            updateForm({
                              individualChoice2: val,
                              individualChoice1: "",
                            });
                            checkRequired(updated);
                          } else {
                            const updated = {
                              ...formData,
                              individualChoice2: val,
                            };
                            updateForm({ individualChoice2: val });
                            checkRequired(updated);
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
                      <FieldLabel>
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            updateForm({ individualChoice2: "" });
                            checkRequired({
                              ...formData,
                              individualChoice2: "",
                            });
                          }}
                          size="sm"
                        >
                          Clear Selection for Individual Event 2
                        </Button>
                      </FieldLabel>
                    </Field>
                  )}
              </>
            )}

            {/* Event Participation Info for Group 2 or 3 Participants */}
            {(formData.group === "2" || formData.group === "3") && (
              <>
                {/* Quiz or Drawing Participation Field */}
                <Field>
                  {formData.showErrors &&
                    formData.participateInQuizDrawing == "" && (
                      <div className="text-red-600 text-sm">
                        Please indicate whether you want to participate in Quiz
                        or Drawing
                      </div>
                    )}
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
                        const updated = {
                          ...formData,
                          participateInQuizDrawing: val,
                          participateInGroupEvent: "",
                          individualChoice2: "",
                        };
                        updateForm({
                          participateInQuizDrawing: val,
                          participateInGroupEvent: "",
                          individualChoice2: "",
                        });
                        checkRequired(updated);
                      } else {
                        const updated = {
                          ...formData,
                          participateInQuizDrawing: val,
                        };
                        updateForm({ participateInQuizDrawing: val });
                        checkRequired(updated);
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
                    {formData.showErrors &&
                      formData.participateInQuizDrawing == "none" &&
                      formData.participateInGroupEvent == "" && (
                        <div className="text-red-600 text-sm">
                          Please indicate whether you want to participate in a
                          Group Event
                        </div>
                      )}
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
                          const updated = {
                            ...formData,
                            participateInGroupEvent: val,
                            individualChoice2: "",
                          };
                          updateForm({
                            participateInGroupEvent: val,
                            individualChoice2: "",
                          });
                          checkRequired(updated);
                        } else {
                          const updated = {
                            ...formData,
                            participateInGroupEvent: val,
                          };
                          updateForm({ participateInGroupEvent: val });
                          checkRequired(updated);
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
                {((formData.participateInQuizDrawing !== "" &&
                  formData.participateInQuizDrawing !== "none") ||
                  formData.participateInGroupEvent !== "") && (
                  <Field>
                    {formData.showErrors &&
                      formData.participateInGroupEvent == "none" &&
                      formData.participateInQuizDrawing == "none" &&
                      formData.individualChoice1 == "" && (
                        <div className="text-red-600 text-sm">
                          You have to choose atleast 1 indiviual event
                        </div>
                      )}
                    <FieldLabel>
                      Please select the Individual Event you would like to
                      participate in:{" "}
                      {formData.participateInGroupEvent == "none" &&
                      formData.participateInQuizDrawing == "none"
                        ? "*"
                        : "(Optional)"}
                    </FieldLabel>

                    <RadioGroup
                      value={formData.individualChoice1.toString()}
                      onValueChange={(val) => {
                        console.log(val);
                        if (
                          (val === "bhajans" || val === "tamizh-chants") &&
                          formData.participateInGroupEvent === "none"
                        ) {
                          toast.error(
                            "Bhajans and Tamizh Chants can't be chosen together. The other option has been cleared automatically.",
                            {
                              action: {
                                label: "Close",
                                onClick: () => {},
                              },
                            },
                          );
                        }
                        if (
                          (val === "bhajans" &&
                            formData.individualChoice2 === "tamizh-chants") ||
                          (val === "tamizh-chants" &&
                            formData.individualChoice2 === "bhajans")
                        ) {
                          const updated = {
                            ...formData,
                            individualChoice1: val,
                            individualChoice2: "",
                          };
                          updateForm({
                            individualChoice1: val,
                            individualChoice2: "",
                          });
                          checkRequired(updated);
                        } else {
                          const updated = {
                            ...formData,
                            individualChoice1: val,
                          };
                          updateForm({ individualChoice1: val });
                          checkRequired(updated);
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
                      {formData.individualChoice2 !==
                        "story-telling-english" && (
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
                      {formData.individualChoice2 !==
                        "story-telling-tamizh" && (
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
                    <FieldLabel>
                      {(formData.participateInQuizDrawing == "quiz" ||
                        formData.participateInQuizDrawing == "drawing" ||
                        formData.participateInGroupEvent != "none") && (
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            updateForm({ individualChoice1: "" });
                            checkRequired({
                              ...formData,
                              individualChoice1: "",
                            });
                          }}
                          size="sm"
                        >
                          Clear Selection for Individual Event 1
                        </Button>
                      )}
                    </FieldLabel>
                  </Field>
                )}

                {/* Individual Event Choice 2 Field (shown only if participant doesn't participate in Devotional Singing)*/}
                {formData.participateInQuizDrawing === "none" &&
                  formData.participateInGroupEvent === "none" &&
                  formData.individualChoice1 && (
                    <Field>
                      <FieldLabel>
                        Please select the 2nd Individual Event you would like to
                        participate in: (Optional)
                      </FieldLabel>

                      <RadioGroup
                        value={formData.individualChoice2.toString()}
                        onValueChange={(val) => {
                          if (val === "bhajans" || val === "tamizh-chants") {
                            toast.error(
                              "Bhajans and Tamizh Chants can't be chosen together. The other option has been cleared automatically.",
                              {
                                action: {
                                  label: "Close",
                                  onClick: () => {},
                                },
                              },
                            );
                          }
                          console.log(val);
                          if (
                            (val === "bhajans" &&
                              formData.individualChoice1 === "tamizh-chants") ||
                            (val === "tamizh-chants" &&
                              formData.individualChoice1 === "bhajans")
                          ) {
                            const updated = {
                              ...formData,
                              individualChoice2: val,
                              individualChoice1: "",
                            };
                            updateForm({
                              individualChoice2: val,
                              individualChoice1: "",
                            });
                            checkRequired(updated);
                          } else {
                            const updated = {
                              ...formData,
                              individualChoice2: val,
                            };
                            updateForm({ individualChoice2: val });
                            checkRequired(updated);
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
                      <FieldLabel>
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            updateForm({ individualChoice2: "" });
                            checkRequired({
                              ...formData,
                              individualChoice2: "",
                            });
                          }}
                          size="sm"
                        >
                          Clear Selection for Individual Event 2
                        </Button>
                      </FieldLabel>
                    </Field>
                  )}
              </>
            )}

            {/* Event Participation Info for Group 4 Participants */}
            {formData.group === "4" && (
              <>
                {/* Quiz Participation Field*/}
                <Field>
                  {formData.showErrors &&
                    formData.participateInQuizDrawing == "" && (
                      <div className="text-red-600 text-sm">
                        Please indicate whether you want to participate in Quiz
                        or Drawing
                      </div>
                    )}
                  <FieldLabel>Do you want to participate in Quiz? *</FieldLabel>

                  <RadioGroup
                    value={formData.participateInQuizDrawing.toString()}
                    onValueChange={(val) => {
                      console.log(val);
                      const updated = {
                        ...formData,
                        participateInQuizDrawing: val,
                      };
                      updateForm({ participateInQuizDrawing: val });
                      checkRequired(updated);
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
