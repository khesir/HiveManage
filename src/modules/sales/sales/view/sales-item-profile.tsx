import useServiceFormStore from '@/components/hooks/use-service-store';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {dateParser} from '@/lib/util/utils';
import {Separator} from '@/components/ui/separator';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination';

export function SalesItemProfile() {
	const {data} = useServiceFormStore();
	// TODO: Add a fallback action for data : Very Edge case
	const renderBoolean = (value: boolean | undefined | null) => {
		return value ? 'Active' : 'Inactive';
	};
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{data?.service_title}
					</CardTitle>
					<CardDescription>
						{dateParser(data?.created_at ?? '')}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex flex-col gap-3">
							<span className="text-muted-foreground">Description</span>
							<span className="pl-3">{data?.service_description}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>{data?.service_status}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Reservation</span>
							<span>{renderBoolean(data?.has_reservation)}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Borrow</span>
							<span>{renderBoolean(data?.has_borrow)}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Job-Oder</span>
							<span>{renderBoolean(data?.has_job_order)}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<div className="font-semibold mb-3">Customer Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Fullname</span>
							<span>
								{data?.customer.lastname}
								{', '}
								{data?.customer.firstname} {data?.customer.middlename}
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{data?.customer.contact_phone}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Addressline</span>
							<span>{data?.customer.addressline}.</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">City</span>
							<span>{data?.customer.province}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Standing</span>
							<span>{data?.customer.standing}</span>
						</li>
					</ul>
				</div>
			</CardContent>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					Updated{' '}
					<time dateTime="2023-11-23">
						{dateParser(data?.last_updated ?? '')}
					</time>
				</div>
				<Pagination className="ml-auto mr-0 w-auto">
					<PaginationContent>
						<PaginationItem>
							<Button size="icon" variant="outline" className="h-6 w-6">
								<ChevronLeft className="h-3.5 w-3.5" />
								<span className="sr-only">Previous Order</span>
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button size="icon" variant="outline" className="h-6 w-6">
								<ChevronRight className="h-3.5 w-3.5" />
								<span className="sr-only">Next Order</span>
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</CardFooter>
		</Card>
	);
}
