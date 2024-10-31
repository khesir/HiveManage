import {ItemWithDetails} from '@/lib/inventory-zod-schema';
import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';

export const columns: ColumnDef<ItemWithDetails>[] = [
	{
		accessorKey: 'product.name',
		header: 'Name',
	},
	{
		accessorKey: 'product.price',
		header: 'Price',
	},
	{
		accessorKey: 'stock',
		header: 'Stocks',
	},
	{
		accessorKey: 'tag',
		header: 'Tag',
	},
	{
		accessorKey: 'on_listing',
		header: 'Listed',
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
