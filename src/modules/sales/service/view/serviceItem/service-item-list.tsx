import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {useParams, useSearchParams} from 'react-router-dom';
import {ServiceItem} from '@/components/validation/service-item';
import {ColumnDef, Row} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import {ServiceItemTable} from './service-item-table';
import {AvatarCircles} from '@/components/ui/avatarcircles';
const ActionCell = (data: ServiceItem) => {
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

export const columns: ColumnDef<ServiceItem>[] = [
	{
		accessorKey: 'service_item_id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof row.original?.product?.img_url === 'string'
										? row.original.product?.img_url
										: '',
								name: row.original.product?.name ?? '',
							},
						]}
					/>
					<span>{`${row.original.product?.name}`}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
	},
	{
		accessorKey: 'sold_price',
		header: 'Item Price',
	},
	{
		header: 'Total Price',
		cell: ({row}) => row.original.quantity * row.original.sold_price,
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Action',
		cell: ({row}: {row: Row<ServiceItem>}) => <ActionCell {...row.original} />,
	},
];

export default function ServiceItemList() {
	const [searchParams] = useSearchParams();
	const [ownedItems, setOwnedItems] = useState<ServiceItem[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const {service_id, joborder_id} = useParams();

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<ServiceItem>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/service-items?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setOwnedItems(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort]);
	return (
		<ServiceItemTable
			columns={columns}
			data={ownedItems}
			pageCount={pageCount}
		/>
	);
}
