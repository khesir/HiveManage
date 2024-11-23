import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {ItemRecordsWithDetails} from '../../_components/validation/product';
export const columns: ColumnDef<ItemRecordsWithDetails>[] = [
	{
		accessorKey: 'supplier.profile_link',
		header: 'IMAGE',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[70px]">
					<img
						src={
							row.original.supplier?.profile_link
								? typeof row.original.supplier.profile_link === 'string'
									? row.original.supplier.profile_link
									: URL.createObjectURL(row.original.supplier.profile_link)
								: '/img/placeholder.jpg'
						}
						alt={`product ID ${row.original.supplier?.supplier_id} - ${row.original.supplier?.name}`}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'supplier.name',
		header: 'SUPPLIER NAME',
	},
	{
		id: 'condition',
		header: 'Condition',
		cell: ({row}) => <Badge>{row.original.condition}</Badge>,
	},
	{
		id: 'stock',
		header: 'Stock',
		cell: ({row}) => (row.original.stock ? row.original.stock : 'N/A'),
	},
	{
		id: 'reserve_stock',
		header: 'Reserve Stock',
		cell: ({row}) => (row.original.stock ? row.original.reserve_stock : 'N/A'),
	},
	{
		id: 'unit_price',
		header: 'Unit Price',
		cell: ({row}) =>
			row.original.unit_price ? row.original.unit_price : 'N/A',
	},
];
