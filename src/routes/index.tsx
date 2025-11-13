import { createFileRoute } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import StudentInfo from "@/components/form/StudentInfo";
import Accompany from "@/components/form/Accompany";
import Accomodate from "@/components/form/Accomodate";

import { useFormStore } from "@/store/formStore";
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute("/")({
	component: App,
});

// Landing page
// Will have the progress-bar and the next prev buttons

// Have a Section identifier to know what section it is rn
// Using the section identifier, we implement navigation next or prev


function App() {
	const {formData, updateForm } = useFormStore();
	const Sections = [
		<StudentInfo/>,
		<Accompany/>,
		<Accomodate/>
	]

	return (
		// Progress Bar
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<div className="container w-full md:w-1/2 mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-5">
					<h1 className="text-indigo-900">Balvikas Registration Form</h1>
					<p className="text-slate-600">
						Complete all sections to register for the event
					</p>
				</div>

				{/* Progress bar  */}
				{/* Will store section, percentage complete, title in tanstack global store for dynamic renderring */}
				<div className="mb-5 bg-white rounded-lg shadow-sm p-6">
					<div className="flex justify-between items-center mb-3">
						<span className="text-slate-700">Section x of y</span>
						<span className="text-indigo-600">15% Complete</span>
					</div>
					<Progress value={((formData.sectionNumber+1)/3)*100} />
					<p className="mt-3 text-slate-600">Section Title</p>
				</div>

				{/* Form content  */}
				{/* This will be rendered dynamically based on form progress */}
				{Sections[formData.sectionNumber]}

				{/* I'm thinking only 1 page to be shown in pagination, the current page... */}
				{/* Can be debated upon later */}
				{/* The logic for navigation will also be extracted out to a diff component */}
				<div className="flex items-center justify-between mt-4">
					<Button
						variant="outline"
						onClick={() => updateForm({ sectionNumber: formData.sectionNumber - 1 })}
						disabled={formData.sectionNumber === 0}
					>
						<ArrowLeft />
						Previous
					</Button>

					<Button
						onClick={() => updateForm({ sectionNumber: formData.sectionNumber + 1 })}
						disabled={!formData.nextSectionEnable?.[formData.sectionNumber]}
					>
						Next
						<ArrowRight />
					</Button>
				</div>
			</div>
		</div>
		// Next-Prev buttons
	);
}
