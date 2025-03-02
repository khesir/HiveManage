import {PaginationResponse, request} from '@/api/axios';
import {SerializeItem} from '@/modules/inventory/_components/validation/serialize-items';
import {useEffect, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {SerialiItemTable} from './serialize-item-table';

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
];

interface ProductWithDetails {
	searchParams: URLSearchParams;
	product_id: string;
}

export default function SerializeItemRecord({
	searchParams,
	product_id,
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
				`/api/v1/ims/product/${product_id}/serializeItems?limit=${pageLimit}&offset=${offset}` +
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
		/>
	);
}
