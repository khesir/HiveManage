import {ApiRequest, PaginationResponse, request} from '@/api/axios';
import {EmployeeRolesWithDetails} from '../validation/employeeRoles';
import {
	EmploymentInformationWithDetails,
	PersonalInformation,
} from '../validation/employee';

export async function UpdateEmployee(
	formData: FormData,
	employee_id: number,
): Promise<EmployeeRolesWithDetails> {
	await request('PUT', `/api/v1/ems/employees/${employee_id}`, formData);

	const empRoleData = await request<
		PaginationResponse<EmployeeRolesWithDetails>
	>('GET', `/api/v1/ems/employeeRoles?employee_id=${employee_id}`);
	return empRoleData.data[0];
}

export async function CreateEmployment(
	data: object,
	employee_id: number,
): Promise<EmploymentInformationWithDetails> {
	await request<ApiRequest<EmploymentInformationWithDetails>>(
		'POST',
		`api/v1/ems/employees/${employee_id}/employmentInformation`,
		data,
	);
	const response = await request<ApiRequest<EmploymentInformationWithDetails>>(
		'GET',
		`api/v1/ems/employees/${employee_id}/employmentInformation`,
	);
	if (Array.isArray(response.data)) {
		return response.data[0];
	}
	return response.data;
}

export async function UpdateEmployment(
	data: object,
	employee_id: number,
	employment_id: number,
): Promise<EmploymentInformationWithDetails> {
	await request<ApiRequest<EmploymentInformationWithDetails>>(
		'PUT',
		`api/v1/ems/employees/${employee_id}/employmentInformation/${employment_id}`,
		data,
	);
	const response = await request<ApiRequest<EmploymentInformationWithDetails>>(
		'GET',
		`api/v1/ems/employees/${employee_id}/employmentInformation`,
	);
	if (Array.isArray(response.data)) {
		return response.data[0];
	}
	return response.data;
}

export async function CreatePersonal(
	data: object,
	employee_id: number,
): Promise<PersonalInformation> {
	await request<ApiRequest<PersonalInformation>>(
		'POST',
		`api/v1/ems/employees/${employee_id}/personalInformation`,
		data,
	);
	const response = await request<ApiRequest<PersonalInformation[]>>(
		'GET',
		`api/v1/ems/employees/${employee_id}/personalInformation`,
	);
	const res = response.data as PersonalInformation[];
	return res[0];
}

export async function UpdatePersonal(
	data: object,
	employee_id: number,
	personal_id: number,
): Promise<PersonalInformation> {
	await request<ApiRequest<PersonalInformation>>(
		'PUT',
		`api/v1/ems/employees/${employee_id}/personalInformation/${personal_id}`,
		data,
	);
	const response = await request<ApiRequest<PersonalInformation[]>>(
		'GET',
		`api/v1/ems/employees/${employee_id}/personalInformation`,
	);
	const res = response.data as PersonalInformation[];
	return res[0];
}
