import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {ColumnDef, Row} from '@tanstack/react-table';
import {Joborder} from '@/components/validation/joborder';
import {Badge} from '@/components/ui/badge';
import {dateParser} from '@/lib/util/utils';
import {JoborderTable} from './joborder-table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
const ActionCell = (data: Joborder) => {
	const navigate = useNavigate();
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button onClick={() => navigate(`${data.joborder_id}`)}>
							View
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>View Joborder</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export const columns: ColumnDef<Joborder>[] = [
	{
		accessorKey: 'joborder_id',
		header: 'ID',
	},
	{
		header: 'Status',
		cell: ({row}) => {
			return <Badge>{row.original?.status ?? 'N/A'}</Badge>;
		},
	},
	{
		accessorKey: 'expected_completion_date',
		header: 'Expected Completion Date',
		cell: ({row}) =>
			new Date(
				row.original.expected_completion_date ?? '',
			).toLocaleDateString(),
	},
	{
		accessorKey: 'completed_at',
		header: 'Completed At',
		cell: ({row}) =>
			new Date(
				row.original.expected_completion_date ?? '',
			).toLocaleDateString(),
	},
	{
		accessorKey: 'turned_over_at',
		header: 'Turned over at',
		cell: ({row}) =>
			new Date(
				row.original.expected_completion_date ?? '',
			).toLocaleDateString(),
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Action',
		cell: ({row}: {row: Row<Joborder>}) => <ActionCell {...row.original} />,
	},
];

export default function JoborderList() {
	const [searchParams] = useSearchParams();
	const [joborder, setjoborder] = useState<Joborder[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const joborderType = searchParams.get('joborderType') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchJoborders = async () => {
			const res = await request<PaginationResponse<Joborder>>(
				'GET',
				`/api/v1/sms/joborder?limit=${pageLimit}&offset=${offset}` +
					(joborderType ? `&joborderType=${joborderType}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setjoborder(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchJoborders();
	}, [offset, pageLimit, sort, joborderType]);
	return (
		<JoborderTable columns={columns} data={joborder} pageCount={pageCount} />
	);
}
