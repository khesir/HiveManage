import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';

import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {Card, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Input} from '@/components/ui/input';
import {TaskWithDetails} from '../validation/task';
import {JobOrderWithDetails} from '../validation/joborder';
import useTicketArrayStore from '../hooks/use-ticket-array-store';
import {EmployeeAvatarCircles} from '@/components/ui/avatarcircles';

interface ItemListingModal {
	title: string;
	joborder: JobOrderWithDetails;
}

export function TaskListingModal({title, joborder}: ItemListingModal) {
	const {addTicketStoreWithDetails} = useTicketArrayStore();

	const [fullRemarkTickets, setFullRemarkTickets] = useState<TaskWithDetails[]>(
		[],
	);
	const [remarkTickets, setRemarkTickets] = useState<TaskWithDetails[]>([]);

	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);

	const pageSizeOptions = [10, 20, 30, 50, 100];

	useEffect(() => {
		const fetchItems = async () => {
			const res = await request<PaginationResponse<TaskWithDetails>>(
				'GET',
				`/api/v1/sms/service/${joborder.service.service_id}/joborder/${joborder.joborder_id}/remark-tickets?no_pagination=true`,
			);
			setFullRemarkTickets(res.data);
			setPageCount(Math.ceil(res.total_data / pageSize));
		};
		fetchItems();
	}, [joborder]);

	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = fullRemarkTickets.slice(offset, offset + pageSize);
		setRemarkTickets(paginatedData);
	}, [fullRemarkTickets, pageIndex, pageSize]);

	const handlePaginationChange = (newPageIndex: number) => {
		setPageIndex(newPageIndex);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Add Ticket</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader className="font-semibold text-lg">{title}</DialogHeader>
				<DialogDescription className="text-muted-foreground text-md">
					Just Click Add, and it will be added to the items
				</DialogDescription>
				<div className="w-full">
					<Input placeholder="Search Something" className="w-full" />
				</div>
				<ScrollArea className="h-[calc(90vh-210px)] px-2">
					<div className="flex flex-col gap-3">
						{remarkTickets.map((ticket) => (
							<Card
								className="relative w-full h-[100px] overflow-hidden"
								key={ticket.remark_id}
							>
								<div className="flex justify-start">
									<CardHeader className="flex flex-col justify-start">
										<CardTitle className="font-semibold text-sm  hover:underline">
											{`#${ticket.remark_id}, ${ticket.title} - ${ticket.remarkticket_status}`}
										</CardTitle>
									</CardHeader>
								</div>
								<CardFooter className="flex justify-between">
									<EmployeeAvatarCircles
										employees={ticket.remark_assign.map(
											(assign) => assign.employee,
										)}
									/>
									<Button
										className="bg-green-400 hover:bg-green-200"
										onClick={() => addTicketStoreWithDetails(ticket)}
									>
										Add
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</ScrollArea>
				<div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
							<div className="flex items-center space-x-2">
								<p className="whitespace-nowrap text-sm font-medium">
									Rows per page
								</p>
								<Select
									value={pageSize.toString()}
									onValueChange={(value: string) => setPageSize(Number(value))}
								>
									<SelectTrigger className="h-8 w-[70px]">
										<SelectValue placeholder={pageSize.toString()} />
									</SelectTrigger>
									<SelectContent side="top">
										{pageSizeOptions.map((size) => (
											<SelectItem key={size} value={`${size}`}>
												{size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<div className="flex w-[200px] items-center justify-center text-sm font-medium">
						Page {pageIndex + 1} of {pageCount}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							aria-label="Go to first page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => handlePaginationChange(0)}
							disabled={pageIndex === 0}
						>
							<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to previous page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handlePaginationChange(pageIndex - 1)}
							disabled={pageIndex === 0}
						>
							<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to next page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handlePaginationChange(pageIndex + 1)}
							disabled={pageIndex + 1 >= pageCount}
						>
							<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to last page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => handlePaginationChange(pageCount - 1)}
							disabled={pageIndex + 1 >= pageCount}
						>
							<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
