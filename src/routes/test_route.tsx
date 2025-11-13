import { createFileRoute } from "@tanstack/react-router";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/test_route")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<div>Hello "/test_route"!</div>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="/" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">2</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="/" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</>
	);
}
