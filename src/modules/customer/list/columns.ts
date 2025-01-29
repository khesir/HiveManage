import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {Customer} from '@/lib/cms-zod-schema';

export const columns: ColumnDef<Customer>[] = [
	{
		// Custom accessor to combine first_name, middle_name, last_name
		id: 'fullname',
		header: 'Name',
		accessorFn: (row) =>
			`${row.firstname} ${row.middlename ? row.middlename + ' ' : ''}${row.lastname}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'standing',
		header: 'Standing',
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
