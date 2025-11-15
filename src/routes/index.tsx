import { createFileRoute } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import StudentInfo from "@/components/form/StudentInfo";
import Accompany from "@/components/form/Accompany";
import Accomodate from "@/components/form/Accomodate";
import EventParticipationInfo from "@/components/form/EventParticipationInfo";
import LogisticsInfo from "@/components/form/LogisticsInfo";
import Preview from "@/components/form/Preview";

import { useFormStore } from "@/store/formStore";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAddRegistration } from "@/utils/addReg";
import { ModalToast } from "@/components/ui/modalToast";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

// Landing page
// Will have the progress-bar and the next prev buttons

// Have a Section identifier to know what section it is rn
// Using the section identifier, we implement navigation next or prev

function App() {
  const { formData, updateForm, resetForm } = useFormStore();
  const mutation = useAddRegistration();
  const Sections = [
    <StudentInfo />,
    <EventParticipationInfo />,
    <LogisticsInfo />,
    <Accompany />,
    <Accomodate />,
    <Preview />,
  ];

  let progress = (Math.min(formData.sectionNumber, 5) / 5) * 100;
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMode, setToastMode] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [toastMsg, setToastMsg] = useState("");

  return (
    // Progress Bar
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-indigo-100/60 to-purple-100/60">
      {mutation.isPending && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]" />
      )}
      <ModalToast
        open={toastOpen}
        mode={toastMode}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />

      <div className="container w-full md:w-1/2 mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">
            State Level Balvikas Talent Search 2025
          </h1>
          <p className="text-slate-600 text-base mt-2">Registration Portal</p>
        </div>

        {/* Progress bar  */}
        {/* Will store section, percentage complete, title in tanstack global store for dynamic renderring */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-700 font-medium">
              Section {formData.sectionNumber + 1} of {Sections.length}
            </span>
            <span className="text-black font-medium">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <Progress value={progress} />
        </div>

        {/* Prev Next TOP*/}
        {formData.sectionNumber != 5 && (
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() =>
                updateForm({ sectionNumber: formData.sectionNumber - 1 })
              }
              disabled={formData.sectionNumber === 0}
              className="cursor-pointer"
            >
              <ArrowLeft />
              Previous
            </Button>

            {formData.sectionNumber != 5 && (
              <Button
                onClick={() => {
                  if (
                    formData.nextSectionEnable[formData.sectionNumber] == false
                  ) {
                    updateForm({ showErrors: true });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    updateForm({ sectionNumber: formData.sectionNumber + 1 });
                  }
                }}
                className="cursor-pointer"
              >
                Next
                <ArrowRight />
              </Button>
            )}
            {formData.sectionNumber == 5 && (
              <Button
                onClick={() =>
                  // submit sm shi
                  // idk
                  console.log("Submitted", formData)
                }
                className="cursor-pointer"
              >
                REGISTER
              </Button>
            )}
          </div>
        )}

        {/* Form content  */}
        {/* This will be rendered dynamically based on form progress */}
        {Sections[formData.sectionNumber]}

        {/* Prev Next BOTTOM*/}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() =>
              updateForm({ sectionNumber: formData.sectionNumber - 1 })
            }
            disabled={formData.sectionNumber === 0}
            className="cursor-pointer"
          >
            <ArrowLeft />
            Previous
          </Button>

          {formData.sectionNumber != 5 && (
            <Button
              onClick={() => {
                if (
                  formData.nextSectionEnable[formData.sectionNumber] == false
                ) {
                  updateForm({ showErrors: true });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  updateForm({ sectionNumber: formData.sectionNumber + 1 });
                }
              }}
              className="cursor-pointer"
            >
              Next
              <ArrowRight />
            </Button>
          )}
          {formData.sectionNumber == 5 && (
            <Button
              onClick={() => {
                // Start loading toast
                setToastMsg("Submitting registration…");
                setToastMode("loading");
                setToastOpen(true);

                mutation.mutate(formData, {
                  onSuccess: () => {
                    setToastMsg("Registration successful!");
                    setToastMode("success");
                    // resetForm();
                  },
                  onError: (e) => {
                    console.log(e);
                    setToastMsg("Something went wrong!");
                    setToastMode("error");
                  },
                });
              }}
              className="cursor-pointer"
            >
              REGISTER
            </Button>
          )}
        </div>
      </div>
    </div>
    // Next-Prev buttons
  );
}
