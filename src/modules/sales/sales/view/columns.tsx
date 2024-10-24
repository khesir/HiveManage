import {SalesItemWithDetails} from '@/lib/sales-zod-schema';
import {ColumnDef} from '@tanstack/react-table';

export const columns: ColumnDef<SalesItemWithDetails>[] = [
	{
		accessorKey: 'item.product.name',
		header: 'Name',
		accessorFn: (row) =>
			`${row.item.product.name} - ${row.item.product.supplier.name}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'item.product.price',
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
