import {SalesItemWithDetails} from '@/lib/sales-zod-schema';
import {ColumnDef} from '@tanstack/react-table';

export const columns: ColumnDef<SalesItemWithDetails>[] = [
	{
		id: 'item_name',
		header: 'Name',
		accessorFn: (row) => `${row.item.variant.variant_name}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'item.item_type',
		header: 'Item Type',
	},
	{
		accessorKey: 'item.variant.price',
		header: 'Price',
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
	},
	{
		accessorKey: 'sales_item_type',
		header: 'Type',
	},
	{
		accessorKey: 'total_price',
		header: 'Total Price',
	},
];
