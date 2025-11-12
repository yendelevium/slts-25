import { createFileRoute } from '@tanstack/react-router'
import { Progress } from "@/components/ui/progress"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export const Route = createFileRoute('/')({
  component: App,
})

// Landing page
// Will have the progress-bar and the next prev buttons

// Have a Section identifier to know what section it is rn
// Using the section identifier, we implement navigation next or prev



function App() {
  return (
    // Progress Bar
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-indigo-900">Balvikas Registration Form</h1>
          <p className="text-slate-600">Complete all sections to register for the event</p>
        </div>

        {/* Progress bar  */}

        <div className="mb-5 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-700">Section x of y</span>
            <span className="text-indigo-600">15% Complete</span>
          </div>
          <Progress value={15} />
          <p className="mt-3 text-slate-600">Section Title</p>
        </div>


        {/* Form content  */}


        {/* Navigation */}
        {/* I'm thinking only 1 page to be shown in pagination, the current page... */}
        {/* Can be debated upon later */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    // Next-Prev buttons
  )
}
