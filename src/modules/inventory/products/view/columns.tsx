import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {InventoryRecordsWithDetails} from '../../_components/validation/product';
export const columns: ColumnDef<InventoryRecordsWithDetails>[] = [
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
		accessorKey: 'inventory_record_id',
		header: 'ID',
	},
	{
		accessorKey: 'supplier.name',
		header: 'SUPPLIER NAME',
	},
	{
		id: 'tag',
		header: 'Tag',
		cell: ({row}) => <Badge>{row.original.tag}</Badge>,
	},
	{
		id: 'stock',
		header: 'STOCK',
		cell: ({row}) => (row.original.stock ? row.original.stock : 'N/A'),
	},
	{
		id: 'reserve_stock',
		header: 'RESERVE STOCK',
		cell: ({row}) => (row.original.stock ? row.original.reserve_stock : 'N/A'),
	},
	{
		id: 'unit_price',
		header: 'UNIT PRICE',
		cell: ({row}) =>
			row.original.unit_price ? row.original.unit_price : 'N/A',
	},
];
