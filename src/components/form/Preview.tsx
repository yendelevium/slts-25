import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useFormStore } from "@/store/formStore";

export default function Preview() {
  const { formData } = useFormStore();

  const fmt = (date?: Date) => (date ? date.toLocaleDateString("en-IN") : "—");

  const showAccompany = formData.adultsAccompanying === "yes";
  const showAccom = formData.needAccommodation === "yes";

  // Event component
  const {
    group,
    devotionalSinging,
    individualChoice1,
    individualChoice2,
    participateInQuizDrawing,
    participateInGroupEvent,
  } = formData;

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-y-3">
            <Info label="Name" value={formData.name.toString()} />
            <Info label="Group" value={formData.group.toString()} />

            <Info label="Date of Birth" value={fmt(formData.dob)} />
            <Info label="Gender" value={formData.gender.toString()} />

            <Info label="District" value={formData.district.toString()} />
            <Info label="Samithi" value={formData.samithi.toString()} />

            <Info
              label="Year of Joining"
              value={formData.yearOfJoining.toString()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Participation</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-y-3">
            {group === "1" && (
              <>
                {/* devo only */}
                {devotionalSinging &&
                  !individualChoice1 &&
                  !individualChoice2 && (
                    <Info
                      label="Devotional Singing"
                      value={devotionalSinging.toString()}
                    />
                  )}

                {/* devo + c1 */}
                {devotionalSinging &&
                  individualChoice1 &&
                  !individualChoice2 && (
                    <>
                      <Info
                        label="Devotional Singing"
                        value={devotionalSinging.toString()}
                      />
                      <Info
                        label="Individual Event 1"
                        value={individualChoice1.toString()}
                      />
                    </>
                  )}

                {/* c1 only */}
                {devotionalSinging == "no" &&
                  individualChoice1 &&
                  !individualChoice2 && (
                    <Info
                      label="Individual Event 1"
                      value={individualChoice1.toString()}
                    />
                  )}

                {/* c1 + c2 */}
                {devotionalSinging == "no" &&
                  individualChoice1 &&
                  individualChoice2 && (
                    <>
                      <Info
                        label="Individual Event 1"
                        value={individualChoice1.toString()}
                      />
                      <Info
                        label="Individual Event 2"
                        value={individualChoice2.toString()}
                      />
                    </>
                  )}
              </>
            )}

            {(group === "2" || group === "3") && (
              <>
                {/* If quiz = YES */}
                {(participateInQuizDrawing === "yes" ||
                  participateInQuizDrawing === "quiz" ||
                  participateInQuizDrawing === "drawing") && (
                  <>
                    {/* EVENT 1 → ALWAYS quiz */}
                    <Info
                      label="Individual Event 1"
                      value={participateInQuizDrawing.toString()}
                    />

                    {/* If they ALSO picked an individualChoice1, show as Event 2 */}
                    {individualChoice1 && individualChoice1 !== "none" && (
                      <Info
                        label="Individual Event 2"
                        value={individualChoice1.toString()}
                      />
                    )}
                  </>
                )}

                {/* If quiz = NONE */}
                {participateInQuizDrawing === "none" && (
                  <>
                    {participateInGroupEvent &&
                      participateInGroupEvent !== "none" && (
                        <>
                          <Info
                            label="Group Event"
                            value={participateInGroupEvent.toString()}
                          />

                          {individualChoice1 &&
                            individualChoice1 !== "none" && (
                              <Info
                                label="Individual Event 1"
                                value={individualChoice1.toString()}
                              />
                            )}
                        </>
                      )}

                    {/* No quiz + no group → show individual events */}
                    {participateInGroupEvent === "none" && (
                      <>
                        {individualChoice1 && individualChoice1 !== "none" && (
                          <Info
                            label="Individual Event 1"
                            value={individualChoice1.toString()}
                          />
                        )}

                        {individualChoice2 && individualChoice2 !== "none" && (
                          <Info
                            label="Individual Event 2"
                            value={individualChoice2.toString()}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {group === "4" && (
              <>
                {/* If quiz = YES */}
                {(participateInQuizDrawing === "yes" ||
                  participateInQuizDrawing === "quiz") && (
                  <Info label="Individual Event 1" value="quiz" />
                )}

                {/* If quiz = NO → show nothing */}
                {participateInQuizDrawing === "none" && (
                  <CardDescription className="col-span-2">
                    Not Participating in Quiz
                  </CardDescription>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-3">
            <Info label="Arrival Date" value={fmt(formData.arrivalDate)} />
            <Info
              label="Arrival Time"
              value={formData.arrivalTime.toString() || "—"}
            />
            <Info label="Need Pickup" value={formData.needPickup.toString()} />

            {formData.needPickup === "yes" && (
              <>
                <Info
                  label="Arrival Mode"
                  value={formData.arrivalMode.toString() || "—"}
                />
                <Info
                  label="Pickup Point"
                  value={formData.pickupPoint.toString() || "—"}
                />
              </>
            )}

            <div className="col-span-2 border-t-1 border-gray-300/70 my-1" />

            <Info label="Departure Date" value={fmt(formData.departureDate)} />
            <Info
              label="Departure Time"
              value={formData.departureTime.toString() || "—"}
            />
            <Info label="Need Drop" value={formData.needDrop.toString()} />

            {formData.needDrop === "yes" && (
              <>
                <Info
                  label="Departure Mode"
                  value={formData.departureMode.toString() || "—"}
                />
                <Info
                  label="Drop Point"
                  value={formData.dropPoint.toString() || "—"}
                />
              </>
            )}
          </CardContent>
        </Card>

        {showAccompany && (
          <Card>
            <CardHeader>
              <CardTitle>Accompanying Adults</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3">
                <Info
                  label="Male Members"
                  value={formData.numMaleMembers.toString()}
                />
                <Info
                  label="Female Members"
                  value={formData.numFemaleMembers.toString()}
                />

                <Info
                  label="Point of Contact"
                  value={formData.pocName.toString()}
                />
                <Info
                  label="Relation"
                  value={formData.pocRelation.toString()}
                />
                <Info label="Gender" value={formData.pocGender.toString()} />
                <Info
                  label="Contact Phone"
                  value={formData.pocPhone.toString()}
                />
                <Info label="Age Group" value={formData.pocAge.toString()} />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Accommodation</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-y-3">
            {showAccom ? (
              <>
                <Info
                  label="Check-In"
                  value={`${fmt(formData.checkInDate)} ${formData.checkInTime || ""}`}
                />
                <Info
                  label="Check-Out"
                  value={`${fmt(formData.checkOutDate)} ${formData.checkOutTime || ""}`}
                />

                <Info
                  label="Male Members Staying"
                  value={formData.accomMaleMembers.toString()}
                />
                <Info
                  label="Female Members Staying"
                  value={formData.accomFemaleMembers.toString()}
                />

                {formData.accomMaleMembers === 0 && formData.accomFemaleMembers === 0 && (
                  <p className="col-span-2 text-sm text-muted-foreground">
                    Accommodation chosen for student only.
                  </p>
                )}

                {/* Male staying */}
                {formData.accomMaleMembers > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Male Members Staying</h4>
                    {formData.maleDetails.map((m, i) => (
                      <div key={i} className="text-sm">
                        {i + 1}. {m.name} ({m.phone || "—"})
                      </div>
                    ))}
                  </div>
                )}

                {/* Female staying */}
                {formData.accomFemaleMembers > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Female Members Staying</h4>
                    {formData.femaleDetails.map((m, i) => (
                      <div key={i} className="text-sm">
                        {i + 1}. {m.name} ({m.phone || "—"})
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="col-span-2 text-muted-foreground">No accommodation needed.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/* Small helper component */
function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
