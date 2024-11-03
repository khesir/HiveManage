import {ColumnDef} from '@tanstack/react-table';
import useServiceFormStore from '@/components/hooks/use-service-store';
import {Button} from '@/components/ui/button';
import {useNavigate, useLocation} from 'react-router-dom';
import {TaskWithDetails} from '../../../../_components/validation/task';
import useTicketStore from '../../../../_components/hooks/use-ticket-store';
import {EmployeeAvatarCircles} from '@/components/ui/avatarcircles';

export const ActionsCell = (data: TaskWithDetails) => {
	const {setServiceFormData} = useServiceFormStore();
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (clickData: TaskWithDetails) => {
		const ticket_id = Number(clickData.remark_id);
		useTicketStore.getState().setTicketStore(clickData);
		if (location.pathname.includes('/sales')) {
			navigate(
				`/sales/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${ticket_id}`,
			);
		} else if (location.pathname.includes('/admin')) {
			navigate(
				`/admin/sales/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${ticket_id}`,
			);
		} else if (location.pathname.includes('/tech')) {
			navigate(
				`/tech/services/joborders/view/${clickData.joborder?.jobrder_id}/task/${ticket_id}`,
			);
		}

		setServiceFormData(data);
	};
	return (
		<Button onClick={() => handleClick(data)} variant={'outline'}>
			View
		</Button>
	);
};

export const columns: ColumnDef<TaskWithDetails>[] = [
	{
		accessorKey: 'remark_id',
		header: 'ID',
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'remark_type.name',
		header: 'Type',
	},
	{
		accessorKey: 'remarkticket_status',
		header: 'Status',
	},
	{
		id: 'remark_assign',
		header: 'Assigned',
		cell: ({row}) => {
			// Render the EmployeeAvatarCircles component with filtered employees
			return (
				<EmployeeAvatarCircles
					employees={row.original.remark_assign.map(
						(assign) => assign.employee,
					)}
				/>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({row}) => <ActionsCell {...row.original} />,
	},
];
