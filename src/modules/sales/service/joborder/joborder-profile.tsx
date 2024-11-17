import {Separator} from '@/components/ui/separator';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useState} from 'react';
import {JobOrderWithDetails} from '../../_components/validation/joborder';
import {Badge} from '@/components/ui/badge';

interface JoborderProfileProps {
	data: JobOrderWithDetails;
}
export function JoborderProfiler({data}: JoborderProfileProps) {
	const pageCount = 2;
	const [pageIndex, setPageIndex] = useState<number>(0);
	const handlePaginationChange = (newPageIndex: number) => {
		setPageIndex(newPageIndex);
	};
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardContent className="p-6 text-sm">
				{pageIndex === 0 ? (
					<>
						<div className="grid gap-3">
							<div className="font-semibold">Joborder Information</div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Joborder Type</span>
									<span>
										{data.joborder_type.map((type) => (
											<Badge
												key={type.joborder_service_id}
												variant={'secondary'}
												className="rounded-sm px-1 font-normal"
											>
												{type.joborder_type.name}
											</Badge>
										))}
									</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<span>{data.joborder_status}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Service Fee</span>
									<span>{data.fee}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Total Cost</span>
									<span>{data.total_cost_price}</span>
								</li>
							</ul>
						</div>
						<Separator className="my-4" />
						<div>
							<div className="font-semibold">Service Information</div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">ID</span>
									<span>{data.service.service_id}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Title</span>
									<span>{data.service.service_title}</span>
								</li>
								<li className="flex flex-col gap-3">
									<span className="text-muted-foreground">Description</span>
									<span className="pl-3">
										{data.service.service_description}
									</span>
								</li>
							</ul>
						</div>
					</>
				) : pageIndex === 1 ? (
					<div className="grid gap-3">
						<div className="font-semibold">Customer Information</div>
						<ul className="grid gap-3">
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Customer ID</span>
								<span>{data.service.customer?.customer_id}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Fullname</span>
								<span>
									{`${data.service.customer?.lastname}, 
									${data.service.customer?.firstname} 
									${data.service.customer.middlename ? data.service.customer.middlename : ''}`}
								</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Contact</span>
								<span>{data.service.customer?.contact_phone}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Standing</span>
								<span>{data.service.customer?.standing}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Email</span>
								<span>{data.service.customer?.email}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Address line</span>
								<span>{data.service.customer?.addressline}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Address line 2</span>
								<span>{data.service.customer?.barangay}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Socials</span>
								<span>not tested</span>
							</li>
						</ul>
					</div>
				) : (
					<p>Not found</p>
				)}
			</CardContent>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					Page {pageIndex + 1} of {pageCount}
				</div>
				<div className="ml-auto mr-0 w-auto">
					<Button
						aria-label="Go to previous page"
						variant="outline"
						size="icon"
						className="h-6 w-6 p-0"
						onClick={() => handlePaginationChange(pageIndex - 1)}
						disabled={pageIndex === 0}
					>
						<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						size="icon"
						className="h-6 w-6 p-0"
						onClick={() => handlePaginationChange(pageIndex + 1)}
						disabled={pageIndex + 1 >= pageCount}
					>
						<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
