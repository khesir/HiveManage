import {ColumnDef} from '@tanstack/react-table';
import {Order} from '../../../components/validation/order';
import {Badge} from '@/components/ui/badge';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'img_url',
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
					<span>{`${row.original.supplier?.name}`}</span>
				</div>
			);
		},
	},
	{
		id: 'order_status',
		header: 'Status',
		cell: ({row}) => <Badge>{row.original.order_status}</Badge>,
	},
	{
		id: 'quantity',
		header: 'Product Count',
		cell: ({row}) => row.original.order_products?.length ?? 0,
	},
	{
		header: 'Qty',
		cell: ({row}) => {
			return (
				<span>
					{row.original.order_products?.length === 0
						? 'No item'
						: `${row.original.order_products?.reduce((sum, product) => sum + (product.total_quantity || 0), 0)}`}
				</span>
			);
		},
	},
	{
		accessorKey: 'expected_arrival',
		header: 'Expected Arrival',
		cell: ({row}) => dateParser(row?.original?.expected_arrival ?? ''),
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? '', true),
	},
];
