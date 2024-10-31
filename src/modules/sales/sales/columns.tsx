import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {useLocation, useNavigate} from 'react-router-dom';
import useServiceFormStore from '@/components/hooks/use-service-store';

const ActionsCell = (data: ServiceWithDetails) => {
	const {setServiceFormData} = useServiceFormStore();
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (service_id: number) => {
		const id = Number(service_id);
		if (location.pathname.includes('/sales')) {
			navigate(`/sales/services/joborder/view/${id}`);
		} else if (location.pathname.includes('/admin')) {
			navigate(`/admin/sales/services/joborder/view/${id}`);
		} else if (location.pathname.includes('/tech')) {
			navigate(`/tech/services/joborder/view/${id}`);
		}
		setServiceFormData(data);
	};

	return <Button onClick={() => handleClick(data.service_id)}>View</Button>;
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
			`${row.customer.firstname} ${row.customer.middlename ? row.customer.middlename + ' ' : ''}${row.customer.lastname}`,
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
