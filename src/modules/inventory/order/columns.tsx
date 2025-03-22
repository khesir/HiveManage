import {ColumnDef} from '@tanstack/react-table';
import {Order} from '../../../components/validation/inventory/order';
import {Badge} from '@/components/ui/badge';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'img_url',
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
		accessorKey: 'order_payment_status',
		header: 'Payment Status',
	},
	{
		accessorKey: 'supplier.contact_number',
		header: 'Contact',
	},
	{
		id: 'order_status',
		header: 'Status',
		cell: ({row}) => <Badge>{row.original.order_status}</Badge>,
	},
	{
		id: 'quantity',
		header: 'Qty',
		cell: ({row}) => row.original.order_products?.length ?? 0,
	},
	{
		accessorKey: 'expected_arrival',
		header: 'Expected Arrival',
		cell: ({row}) => dateParser(row?.original?.expected_arrival ?? ''),
	},
];
