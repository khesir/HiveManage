import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {request} from './axios';
import {Ticket} from '@/components/validation/tickets';
import {EmployeeWithRelatedDetails} from '@/modules/ems/_components/validation/employee';

export const CreateTicket = async (
	ticketData: Ticket,
	selectedEmployees: EmployeeWithRelatedDetails[],
	paramsId: string,
): Promise<void> => {
	try {
		const newData = {
			...ticketData,
			employees: selectedEmployees.map((p) => p.employee.employee_id),
		};
		await request('POST', `/api/v1/sms/service/${paramsId}/ticket`, newData);
		toast.success('Successfully created tickets');
	} catch (e) {
		if (e instanceof Error) {
			toast.error(e.toString());
		} else if (e instanceof AxiosError) {
			toast.error(e.response?.data as string);
		} else {
			toast.error('An unknown error occured');
		}
		console.log(e);
	}
};
