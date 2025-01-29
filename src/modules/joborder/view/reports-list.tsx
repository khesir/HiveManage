import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {dateParser} from '@/lib/util/utils';

import {JobOrderWithDetails} from '@/modules/joborder/_components/validation/joborder';
import {ReportsWithDetails} from '@/modules/joborder/_components/validation/reports';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useState, useEffect} from 'react';

interface ReportsHistoryProps {
	data: JobOrderWithDetails;
}

export function ReportsHistory({data}: ReportsHistoryProps) {
	const [fullReports, setFullReports] = useState<ReportsWithDetails[]>([]);
	const [reports, setReports] = useState<ReportsWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const pageSize = 5;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<ReportsWithDetails>>(
				'GET',
				`/api/v1/sms/service/${data?.service.service_id}/joborder/${data.joborder_id}/reports?no_pagination=true`,
			);
			console.log(res.data);
			setFullReports(res.data);
			setPageCount(Math.ceil(res.total_data / pageSize));
		};

		fetchEmployees();
	}, [data]);

	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = fullReports.slice(offset, offset + pageSize);
		setReports(paginatedData);
	}, [reports, pageIndex, pageSize]);

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
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{reports.length !== 0 ? (
						reports.map((data, index) => (
							<Card
								className="relative w-full h-full flex flex-col"
								key={index}
							>
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{`#${data.reports_id} ${data.reports_title}`}
									</CardTitle>
								</CardHeader>
								<CardFooter className="flex justify-between">
									<p className="text-sm text-gray-600">{`Report date: ${dateParser(data.created_at ?? '')}`}</p>
									<ActionsCell {...data} />
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
const ActionsCell = (data: ReportsWithDetails) => {
	// const {setTaskStoreData} = useTaskStore();
	// const navigate = useNavigate();
	// const location = useLocation();
	const handleClick = (clickData: ReportsWithDetails) => {
		// const data_id = Number(clickData.remark_id);
		// usedataStore.getState().setdataStore(clickData);
		// if (location.pathname.includes('/sales')) {
		// 	navigate(
		// 		`/sales/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${data_id}`,
		// 	);
		// } else if (location.pathname.includes('/admin')) {
		// 	navigate(
		// 		`/admin/sales/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${data_id}`,
		// 	);
		// } else if (location.pathname.includes('/tech')) {
		// 	navigate(
		// 		`/tech/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${data_id}`,
		// 	);
		// }

		// setTaskStoreData(data);
		console.log(clickData);
	};

	return (
		<Button onClick={() => handleClick(data)} variant={'outline'}>
			View
		</Button>
	);
};
