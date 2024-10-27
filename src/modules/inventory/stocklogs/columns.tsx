import {StockLogsWithDetails} from '@/lib/inventory-zod-schema';
import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';

export const columns: ColumnDef<StockLogsWithDetails>[] = [
	{
		accessorKey: 'item.product.name',
		header: 'Name',
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
	},
	{
		accessorKey: 'movement_type',
		header: 'Movement',
	},
	{
		accessorKey: 'action',
		header: 'Action',
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
