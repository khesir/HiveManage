import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {Payment} from '@/components/validation/payment';

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'payment_id',
		header: '',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
	},
	{
		accessorKey: 'discount_amount',
		header: 'Discount Amount',
	},
	{
		accessorKey: 'vat_amount',
		header: 'VAT',
	},
	{
		accessorKey: 'payment_method',
		header: 'Method',
	},
	{
		accessorKey: 'payment_type',
		header: 'Type',
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
