import {PaginationResponse, request} from '@/api/axios';

import {useState, useEffect} from 'react';
import {AuditLogsWithDetails} from './validation/auditlog';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';

interface Props {
	employee_id: number;
}

export function LogListMini({employee_id}: Props) {
	const [fullaudit, setFullAudit] = useState<AuditLogsWithDetails[]>([]);
	const [auditlogs, setAuditLogs] = useState<AuditLogsWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const pageSize = 10;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<AuditLogsWithDetails>>(
				'GET',
				`/api/v1/auditlogs${employee_id ? `?employee_id=${employee_id}` : ''}`,
			);
			console.log(res.data);
			setFullAudit(res.data);
			setPageCount(Math.ceil(res.total_data / pageSize));
		};

		fetchEmployees();
	}, [employee_id]);

	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = fullaudit.slice(offset, offset + pageSize);
		setAuditLogs(paginatedData);
	}, [fullaudit, pageIndex, pageSize]);

	const handlePaginationChange = (newPageIndex: number) => {
		setPageIndex(newPageIndex);
	};

	return (
		<div className="px-3">
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{auditlogs.length !== 0 ? (
						auditlogs.map((data, index) => (
							<Card
								className="relative w-full h-full flex flex-col"
								key={index}
							>
								<CardHeader className="flex justify-start">
									<CardTitle className="font-semibold text-md  hover:underline flex gap-3 items-center">
										<AvatarCircles
											avatar={[
												{
													link: data.employee.profile_link as unknown as string,
													name: `${data.employee.firstname} ${data.employee.middlename} ${data.employee.lastname}`,
												},
											]}
										/>
										{`${data.entity_type}`}
									</CardTitle>
									<CardDescription>{data.action}</CardDescription>
								</CardHeader>
								<CardFooter className="flex justify-between">
									<p className="text-sm text-gray-600">{`${dateParser(data.created_at ?? '', true)}`}</p>
								</CardFooter>
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
		</div>
	);
}
