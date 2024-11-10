import {request} from '@/api/axios';
import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';
import {AssignEmployeeWithDetails} from '@/lib/sales-zod-schema';

export const ProcessAssignEmployee = async (
	newData: EmployeeBasicInformation[],
	oldData: AssignEmployeeWithDetails[],
	joborder_id: number,
	service_id: string,
	interactor: string = 'Some EMployee',
): Promise<void> => {
	// Identify added employees
	const addedEmployees = newData.filter(
		(newEmp) =>
			!oldData.some(
				(oldEmp) => oldEmp.employee.employee_id === newEmp.employee_id,
			),
	);

	// Identify removed employees
	const removedEmployees = oldData.filter(
		(oldEmp) =>
			!newData.some(
				(newEmp) => newEmp.employee_id === oldEmp.employee.employee_id,
			),
	);

	const addRequest = addedEmployees.map((employee) =>
		request(
			'POST',
			`/api/v1/sms/service/${service_id}/joborder/${joborder_id}/assigned-employee`,
			{employee_id: employee.employee_id, assigned_by: interactor},
		),
	);

	const removeRequest = removedEmployees.map((assigned) =>
		request(
			'POST',
			`/api/v1/sms/service/${service_id}/joborder/${joborder_id}/assigned-employee/${assigned.assigned_employee_id}`,
		),
	);

	await Promise.all([...addRequest, ...removeRequest]);
};
