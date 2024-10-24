import {SalesItemWithDetails} from '@/lib/sales-zod-schema';
import {ColumnDef} from '@tanstack/react-table';

export const columns: ColumnDef<SalesItemWithDetails>[] = [
	{
		accessorKey: 'product.name',
		header: 'Name',
		accessorFn: (row) =>
			`${row.item.product.name} - ${row.item.product.supplier}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'item.product.price',
		header: 'Price',
	},
	{
		accessorKey: 'item.quantity',
		header: 'Quantity',
	},
	{
		accessorKey: 'item.sales_item_type',
		header: 'Type',
	},
	{
		accessorKey: 'item.total_price',
		header: 'Total Price',
	},
];
