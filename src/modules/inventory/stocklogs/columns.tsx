import {StockLogsWithDetails} from '@/modules/inventory/_components/validation/product';
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
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
