import {PaginationResponse, request} from '@/api/axios';
import {SerializeItem} from '@/components/validation/inventory/serialize-items';
import {useEffect, useState} from 'react';
import {ColumnDef, Row} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {SerialiItemTable} from './serialize-item-table';
import {Button} from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Logs, Plus} from 'lucide-react';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {useLocation} from 'react-router-dom';

const ActionCell = (data: SerializeItem) => {
	const {addProduct} = useSalesHook();
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
							<Button onClick={() => addProduct(data, 1)}>
								<Plus className="w-4 h-4" />
							</Button>
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

export const columns: ColumnDef<SerializeItem>[] = [
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
		accessorKey: 'serial_number',
		header: 'Serial',
	},
	{
		accessorKey: 'warranty_date',
		header: 'Warranty Date',
		cell: ({row}) => dateParser(row?.original?.warranty_date ?? ''),
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
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Actions',
		cell: ({row}: {row: Row<SerializeItem>}) => (
			<ActionCell {...row.original} />
		),
	},
];

interface ProductWithDetails {
	searchParams: URLSearchParams;
	showControls?: boolean;
	product_id: string;
}

export default function SerializeItemRecord({
	searchParams,
	product_id,
	showControls = true,
}: ProductWithDetails) {
	const [pageCount, setPageCount] = useState<number>(0);
	const [serials, setSerials] = useState<SerializeItem[]>([]);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	const supplier_name = searchParams.get('supplier_name') || undefined;

	useEffect(() => {
		const fetchProducts = async () => {
			const serialItems = await request<PaginationResponse<SerializeItem>>(
				'GET',
				`/api/v1/ims/product/${product_id}/serializeRecord?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : '') +
					(supplier_name ? `&supplier_name=${supplier_name}` : ''),
			);
			setSerials(serialItems.data);
			setPageCount(Math.ceil(serialItems.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, sort, supplier_name]);

	return (
		<SerialiItemTable
			columns={columns}
			data={serials}
			searchKey={'supplier'}
			pageCount={pageCount}
			showControls={showControls}
		/>
	);
}
