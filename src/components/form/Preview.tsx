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

  const fmtDate = (date?: Date) =>
    date ? date.toLocaleDateString("en-IN") : "—";

  const fmtTime = (time?: string) => {
    if (!time) return "—";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const fmtYesNo = (value?: string) => {
    if (!value) return "—";
    if (value === "yes") return "Yes";
    if (value === "no") return "No";
    return value;
  };

  // formatting the event names to show (removing hyphens and capitalising)
  const fmtEventName = (value?: string) => {
    if (!value || value === "none") return "—";
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

            <Info label="Date of Birth" value={fmtDate(formData.dob)} />
            <Info label="Gender" value={formData.gender.toString()} />

            <Info label="District" value={formData.district.toString()} />
            <Info label="Samithi" value={formData.samithi.toString()} />

            <Info
              label="Year of Joining"
              value={formData.yearOfJoining.toString()}
            />
            {formData.dateOfJoining && (
              <Info
                label="Date of Joining"
                value={fmtDate(formData.dateOfJoining)}
              />
            )}

            {formData.foodAllergies && (
              <Info
                label="Food Allergies"
                value={formData.foodAllergies.toString()}
              />
            )}
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
                      value={fmtYesNo(devotionalSinging.toString())}
                    />
                  )}

                {/* devo + c1 */}
                {devotionalSinging &&
                  individualChoice1 &&
                  !individualChoice2 && (
                    <>
                      <Info
                        label="Devotional Singing"
                        value={fmtYesNo(devotionalSinging.toString())}
                      />
                      <Info
                        label="Individual Event 1"
                        value={fmtEventName(individualChoice1.toString())}
                      />
                    </>
                  )}

                {/* c1 only */}
                {devotionalSinging == "no" &&
                  individualChoice1 &&
                  !individualChoice2 && (
                    <Info
                      label="Individual Event 1"
                      value={fmtEventName(individualChoice1.toString())}
                    />
                  )}

                {/* c1 + c2 */}
                {devotionalSinging == "no" &&
                  individualChoice1 &&
                  individualChoice2 && (
                    <>
                      <Info
                        label="Individual Event 1"
                        value={fmtEventName(individualChoice1.toString())}
                      />
                      <Info
                        label="Individual Event 2"
                        value={fmtEventName(individualChoice2.toString())}
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
                      value={fmtEventName(participateInQuizDrawing.toString())}
                    />

                    {/* If they ALSO picked an individualChoice1, show as Event 2 */}
                    {individualChoice1 && individualChoice1 !== "none" && (
                      <Info
                        label="Individual Event 2"
                        value={fmtEventName(individualChoice1.toString())}
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
                            value={fmtEventName(
                              participateInGroupEvent.toString(),
                            )}
                          />

                          {individualChoice1 &&
                            individualChoice1 !== "none" && (
                              <Info
                                label="Individual Event 1"
                                value={fmtEventName(
                                  individualChoice1.toString(),
                                )}
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
                            value={fmtEventName(individualChoice1.toString())}
                          />
                        )}

                        {individualChoice2 && individualChoice2 !== "none" && (
                          <Info
                            label="Individual Event 2"
                            value={fmtEventName(individualChoice2.toString())}
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
                  <Info label="Individual Event 1" value="Quiz" />
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
            <Info label="Arrival Date" value={fmtDate(formData.arrivalDate)} />
            <Info
              label="Arrival Time"
              value={fmtTime(formData.arrivalTime.toString())}
            />
            <Info
              label="Need Pickup"
              value={fmtYesNo(formData.needPickup.toString())}
            />

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

            <Info
              label="Departure Date"
              value={fmtDate(formData.departureDate)}
            />
            <Info
              label="Departure Time"
              value={fmtTime(formData.departureTime.toString())}
            />
            <Info
              label="Need Drop"
              value={fmtYesNo(formData.needDrop.toString())}
            />

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
                  label="Check-In Date"
                  value={fmtDate(formData.checkInDate)}
                />
                <Info
                  label="Check-In Time"
                  value={fmtTime(formData.checkInTime.toString())}
                />
                <Info
                  label="Check-Out Date"
                  value={fmtDate(formData.checkOutDate)}
                />
                <Info
                  label="Check-Out Time"
                  value={fmtTime(formData.checkOutTime.toString())}
                />

                <Info
                  label="Male Members Staying"
                  value={formData.accomMaleMembers.toString()}
                />
                <Info
                  label="Female Members Staying"
                  value={formData.accomFemaleMembers.toString()}
                />

                {formData.accomMaleMembers === 0 &&
                  formData.accomFemaleMembers === 0 && (
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
                    <h4 className="font-semibold mb-2">
                      Female Members Staying
                    </h4>
                    {formData.femaleDetails.map((m, i) => (
                      <div key={i} className="text-sm">
                        {i + 1}. {m.name} ({m.phone || "—"})
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="col-span-2 text-muted-foreground">
                No accommodation needed.
              </p>
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
