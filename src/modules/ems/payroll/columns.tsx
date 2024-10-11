import {Payroll} from '@/components/types';
import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';

export const payrollColumn: ColumnDef<Payroll>[] = [
	{
		id: 'payroll',
		header: 'Payroll Date',
		accessorFn: (row) => `${dateParser(row.start)} - ${dateParser(row.end)}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'pay_date',
		header: 'End',
		accessorFn: (row) => `${dateParser(row.pay_date)}`,
	},
];
