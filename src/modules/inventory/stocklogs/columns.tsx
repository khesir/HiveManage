import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';
import {StockLogs} from '../_components/validation/stock-logs';

export const columns: ColumnDef<StockLogs>[] = [
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
