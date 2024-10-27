import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {RemarkTicketWithDetails} from '@/lib/sales-zod-schema';
import items from '@/modules/inventory/items';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {Badge, ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';

export function TaskListOverview() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [remarkTickets, setRemarkTickets] = useState<RemarkTicketWithDetails[]>(
		[],
	);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageLimit, setPageLimit] = useState<number>(
		Number(searchParams.get('limit')) || 10,
	);
	const page = Number(searchParams.get('page')) || 1;
	const offset = (page - 1) * pageLimit;
	const sort = searchParams.get('sort') || null;
	const currentPage = offset / pageLimit + 1;
	const pageSizeOptions = [10, 20, 30, 50, 100];

	useEffect(() => {
		const fetchItems = async () => {
			const res = await request<PaginationResponse<RemarkTicketWithDetails>>(
				'GET',
				`/api/v1/sms/assigned-employee?employee_id=10` +
					(sort ? `&sort=${sort}` : ''),
			);
			setRemarkTickets(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchItems();
	}, [offset, pageLimit]);

	const handlePaginationChange = (newPage: number) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('page', String(newPage));
		newParams.set('limit', String(pageLimit));
		navigate({search: newParams.toString()});
	};

	const handlePageLimitChange = (newLimit: number) => {
		setPageLimit(newLimit);
	};
	if (items.length === 0) {
		return (
			<Card className="relative w-full h-[170px] overflow-hidden">
				<CardTitle className="h-full font-semibold text-xl  hover:underline flex items-center justify-center">
					No Item Available
				</CardTitle>
			</Card>
		);
	}
	console.log('A');
	return (
		<>
			{/* Render your items */}
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{remarkTickets.map((ticket) => (
						<Card
							className="relative w-full h-[170px] overflow-hidden"
							key={ticket.remark_id}
						>
							<div className="flex justify-start">
								<div className="w-[25%] h-full flex-shrink-0 flex items-center justify-center">
									<img
										src={'/img/placeholder.jpg'}
										className="w-full h-full object-center object-cover"
									/>
								</div>
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{ticket.title}
									</CardTitle>
									<CardDescription>
										<div className="space-x-1">
											<Badge>{ticket.status}</Badge>
										</div>
										<div className="w-[90%]">{ticket.description}</div>
									</CardDescription>
								</CardHeader>
							</div>
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
								value={pageLimit.toString()}
								onValueChange={(value: string) =>
									handlePageLimitChange(Number(value))
								}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue placeholder={pageLimit.toString()} />
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
					Page {currentPage} of {pageCount}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						aria-label="Go to first page"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePaginationChange(1)}
						disabled={currentPage === 1}
					>
						<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to previous page"
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePaginationChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePaginationChange(currentPage + 1)}
						disabled={currentPage === pageCount}
					>
						<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to last page"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePaginationChange(pageCount)}
						disabled={currentPage === pageCount}
					>
						<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</>
	);
}
