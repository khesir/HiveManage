/* eslint-disable @typescript-eslint/no-explicit-any */
import {PaginationResponse, request} from '@/api/axios';
import {Card, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useState, useEffect} from 'react';
import {useJoborderStore} from './hook/useJoborderStore';
import {TaskWithDetails} from './validation/task';
import {Button} from '@/components/ui/button';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {useNavigate, useLocation} from 'react-router-dom';
import useTicketStore from './hook/use-ticket-store';
import useTaskStore from '../../_components/hooks/use-task-store';

export function JoborderTaskList() {
	const {joborderData} = useJoborderStore();
	const [fullRemarkTickets, setFullRemarkTickets] = useState<TaskWithDetails[]>(
		[],
	);
	const [remarkTickets, setRemarkTickets] = useState<TaskWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<TaskWithDetails>>(
				'GET',
				`/api/v1/sms/service/${joborderData?.service.service_id}/joborder/${joborderData?.joborder_id}/remark-tickets?no_pagination=true`,
			);
			setFullRemarkTickets(res.data);
			setPageCount(Math.ceil(res.total_data / pageSize));
		};

		fetchEmployees();
	}, [joborderData]);

	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = fullRemarkTickets.slice(offset, offset + pageSize);
		setRemarkTickets(paginatedData);
	}, [remarkTickets, pageIndex, pageSize]);

	const handlePaginationChange = (newPageIndex: number) => {
		setPageIndex(newPageIndex);
	};

	return (
		<>
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
			<ScrollArea className="h-[calc(80vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{remarkTickets.length !== 0 ? (
						remarkTickets.map((ticket, index) => (
							<Card
								className="relative w-full h-[120px] flex flex-col"
								key={index}
							>
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{`#${ticket.remark_id}, ${ticket.title} - ${ticket.remarkticket_status}`}
									</CardTitle>
								</CardHeader>
								<CardFooter className="flex justify-between">
									<AvatarCircles avatarUrls={['#', '#', '#', '#']} />
									<ActionsCell {...ticket} />
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
		</>
	);
}
const ActionsCell = (data: TaskWithDetails) => {
	const {setTaskStoreData} = useTaskStore();
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (clickData: TaskWithDetails) => {
		const ticket_id = Number(clickData.remark_id);
		useTicketStore.getState().setTicketStore(clickData);
		if (location.pathname.includes('/sales')) {
			navigate(
				`/sales/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${ticket_id}`,
			);
		} else if (location.pathname.includes('/admin')) {
			navigate(
				`/admin/sales/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${ticket_id}`,
			);
		} else if (location.pathname.includes('/tech')) {
			navigate(
				`/tech/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${ticket_id}`,
			);
		}

		setTaskStoreData(data);
	};
	return (
		<Button onClick={() => handleClick(data)} variant={'outline'}>
			View
		</Button>
	);
};
