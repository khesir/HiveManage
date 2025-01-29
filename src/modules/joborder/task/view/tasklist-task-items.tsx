import {PaginationResponse, request} from '@/api/axios';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {TaskItemsWithDetails} from '../../../../_components/validation/task.ts';
import useTicketStore from '@/modules/sales/_components/hooks/use-ticket-store.ts';
import {useParams} from 'react-router-dom';
import {Checkbox} from '@/components/ui/checkbox.tsx';

export function TaskItems() {
	const {data} = useTicketStore();
	const {task_id} = useParams();
	const [fullRemarkItems, setFullRemarkItems] = useState<
		TaskItemsWithDetails[]
	>([]);
	const [remarkItems, setRemarkItems] = useState<TaskItemsWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const pageSize = 5;
	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<TaskItemsWithDetails>>(
				'GET',
				`/api/v1/sms/remark-tickets/${data ? data.remark_id : task_id}/remark-items?no_pagination=true`,
			);
			setFullRemarkItems(res.data);
			setPageCount(Math.ceil(res.total_data / pageSize));
		};

		fetchEmployees();
	}, [data, task_id]);
	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = fullRemarkItems.slice(offset, offset + pageSize);
		setRemarkItems(paginatedData);
	}, [fullRemarkItems, pageIndex, pageSize]);

	const handlePaginationChange = (newPageIndex: number) => {
		setPageIndex(newPageIndex);
	};
	return (
		<>
			<ScrollArea className="h-[calc(85vh-220px)] px-2">
				<div className="flex flex-col gap-3">
					{remarkItems.length !== 0 ? (
						remarkItems.map((data, index) => (
							<Card
								className="relative w-full h-[120px] flex flex-col"
								key={index}
							>
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{data.item?.product?.name}
									</CardTitle>
									<CardDescription>qty: 3</CardDescription>
								</CardHeader>
								<CardFooter className="flex justify-end">
									<Checkbox />
								</CardFooter>
								{/* <div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
								<Button>Remove</Button>
							</div> */}
							</Card>
						))
					) : (
						<div>No available Task</div>
					)}
				</div>
			</ScrollArea>
			<div className="flex flex-row justify-between gap-2 p-2">
				<div className="flex items-center justify-center text-sm font-medium">
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
		</>
	);
}
