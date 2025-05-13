import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {BatchItem} from '@/components/validation/batch-items';
import {BatchRecordTable} from './batch-record-table';

export const columns: ColumnDef<BatchItem>[] = [
	{
		accessorKey: 'product_record_id',
		header: 'ID',
	},
	{
		accessorKey: 'supplier',
		header: 'Supplier',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
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
					<span>{row.original.supplier?.name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'action_type',
		header: 'Action Type',
	},
	{
		accessorKey: 'source',
		header: 'Source',
	},
	{
		header: 'Handled By',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof row.original.handled_by?.profile_link === 'string'
										? row.original.handled_by?.profile_link
										: '',
								name: row.original.handled_by?.firstname ?? '',
							},
						]}
					/>
					<span>
						{row.original.handled_by
							? `${row.original.handled_by.firstname ?? ''} ${row.original.handled_by.lastname ?? ''}`
							: 'Handled by system'}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original.created_at ?? ''),
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
