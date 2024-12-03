import {Button} from '@/components/ui/button';
import {ColumnDef} from '@tanstack/react-table';
import {useNavigate} from 'react-router-dom';
import {Order} from '../_components/validation/order';
import {Badge} from '@/components/ui/badge';

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'img_url',
		header: 'IMG',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[80px]">
					<img
						src={
							typeof row.original.supplier?.profile_link === 'string'
								? row.original.supplier?.profile_link
								: row.original.supplier?.profile_link
									? URL.createObjectURL(row.original.supplier?.profile_link)
									: '/img/placeholder.jpg'
						}
						alt={`Supplier ID ${row.original.supplier_id} - ${row.original.supplier?.name}`}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'order_id',
		header: 'ID',
	},
	{
		accessorKey: 'supplier.name',
		header: 'Supplier Name',
	},
	{
		accessorKey: 'supplier.contact_number',
		header: 'Contact',
	},
	{
		id: 'status',
		header: 'Status',
		cell: ({row}) => <Badge>{row.original.status}</Badge>,
	},
	{
		accessorKey: 'ordered_value',
		header: 'Value',
	},
	{
		id: 'quantity',
		header: 'Items',
		cell: ({row}) => row.original.order_items?.length,
	},
	{
		accessorKey: 'expected_arrival',
		header: 'Expected Arrival',
	},
	{
		id: 'action',
		cell: ({row}: {row: {original: Order}}) => {
			const navigate = useNavigate();

			return (
				<Button onClick={() => navigate(`view/${row.original.order_id}`)}>
					View Details
				</Button>
			);
		},
	},
];
