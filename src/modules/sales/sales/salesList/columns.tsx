import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';

const ActionsCell = ({service_id}: ServiceWithDetails) => {
	const navigate = useNavigate();

	return <Button onClick={() => navigate(`view/${service_id}`)}>View</Button>;
};

export const columns: ColumnDef<ServiceWithDetails>[] = [
	{
		accessorKey: 'service_id',
		header: 'ID',
	},
	{
		id: 'Fullname',
		header: 'Customer Name',
		accessorFn: (row) =>
			`${row.sales.customer.firstname} ${row.sales.customer.middlename ? row.sales.customer.middlename + ' ' : ''}${row.sales.customer.lastname}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'service_status',
		header: 'Status',
	},
	{
		accessorKey: 'last_updated',
		header: 'Last Updated',
		cell: ({row}) => dateParser(row?.original?.last_updated ?? ''),
	},
	{
		accessorKey: 'has_reservation',
		header: 'Reservation',
	},
	{
		accessorKey: 'has_sales_item',
		header: 'Sales',
	},
	{
		accessorKey: 'has_borrow',
		header: 'Borrow',
	},
	{
		accessorKey: 'has_job_order',
		header: 'Joborder',
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({row}) => <ActionsCell {...row.original} />,
	},
];
