import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {useParams, useSearchParams} from 'react-router-dom';
import {OwnedItemTable} from './owned-items-table';
import {ColumnDef, Row} from '@tanstack/react-table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import {OwnedItems} from '@/components/validation/owned-items';
import {dateParser} from '@/lib/util/utils';
const ActionCell = (data: OwnedItems) => {
	console.log(data);
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button>View</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>View Joborder</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export const columns: ColumnDef<OwnedItems>[] = [
	{
		accessorKey: 'service_owned_id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({row}) => row.original.name,
	},
	{
		accessorKey: 'serial_number',
		header: 'Serial Number',
	},
	{
		accessorKey: 'brand',
		header: 'Brand',
	},
	{
		accessorKey: 'model',
		header: 'Model',
	},
	{
		accessorKey: 'notes',
		header: 'Notes',
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Action',
		cell: ({row}: {row: Row<OwnedItems>}) => <ActionCell {...row.original} />,
	},
];

export default function OwnedItemList() {
	const [searchParams] = useSearchParams();
	const [ownedItems, setOwnedItems] = useState<OwnedItems[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const {service_id, joborder_id} = useParams();

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<OwnedItems>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/owned-items?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setOwnedItems(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort]);
	return (
		<OwnedItemTable columns={columns} data={ownedItems} pageCount={pageCount} />
	);
}
