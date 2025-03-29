import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {ColumnDef, Row} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {BatchItem} from '@/components/validation/inventory/batch-items';
import {BatchRecordTable} from './batch-record-table';
import {Button} from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Logs} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import {AddBatchQuantityForm} from './add-batch-qty-form';

const ActionCell = (data: BatchItem) => {
	const location = useLocation();
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button>
							<Logs className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Logs</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{location.pathname.includes('/sales/overview') && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<AddBatchQuantityForm data={data} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Add Item</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
};

export const columns: ColumnDef<BatchItem>[] = [
	{
		accessorKey: 'supplier',
		header: 'Supplier',
		cell: ({row}) => {
			return (
				<AvatarCircles
					avatar={[
						{
							link:
								typeof row.original.supplier?.profile_link === 'string'
									? row.original.supplier?.profile_link
									: '',
							name: row.original.supplier?.name ?? '',
						},
					]}
				/>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
	},
	{
		accessorKey: 'price',
		header: 'Price',
	},
	{
		accessorKey: 'condition',
		header: 'Condition',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original.created_at ?? ''),
	},
	{
		header: 'Actions',
		cell: ({row}: {row: Row<BatchItem>}) => <ActionCell {...row.original} />,
	},
];

interface ProductWithDetails {
	searchParams: URLSearchParams;
	showControls?: boolean;
	product_id: string;
}

export default function BatchRecordList({
	searchParams,
	product_id,
	showControls = true,
}: ProductWithDetails) {
	const [pageCount, setPageCount] = useState<number>(0);
	const [batch, setBatch] = useState<BatchItem[]>([]);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	const supplier_name = searchParams.get('supplier_name') || undefined;

	useEffect(() => {
		const fetchProducts = async () => {
			const batchItems = await request<PaginationResponse<BatchItem>>(
				'GET',
				`/api/v1/ims/product/${product_id}/productRecord?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : '') +
					(supplier_name ? `&supplier_name=${supplier_name}` : ''),
			);
			setBatch(batchItems.data);
			setPageCount(Math.ceil(batchItems.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, sort, supplier_name]);

	return (
		<BatchRecordTable
			columns={columns}
			data={batch}
			searchKey={'supplier'}
			pageCount={pageCount}
			searchParams={searchParams}
			showControls={showControls}
		/>
	);
}
