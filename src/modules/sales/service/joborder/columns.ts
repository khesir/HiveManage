import {ColumnDef} from '@tanstack/react-table';
import {JobOrderWithDetails} from '@/lib/sales-zod-schema';
import {dateParser} from '@/lib/util/utils';

export const columns: ColumnDef<JobOrderWithDetails>[] = [
	{
		accessorKey: 'uuid',
		header: 'UUID',
	},
	{
		accessorKey: 'joborder_type.name',
		header: 'Joborder Type',
	},
	{
		accessorKey: 'joborder_status',
		header: 'Status',
	},
	{
		accessorKey: 'fee',
		header: 'Fee',
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
