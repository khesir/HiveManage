import {ApiRequest, request} from '@/api/axios';
import {Joborder, JobOrderWithDetails} from '../validation/joborder';

export const CreateJoborder = async (
	data: Joborder,
	service_id: string,
): Promise<JobOrderWithDetails> => {
	// Don't use try catch here
	// Insert Saving Logic here
	await request('POST', `/api/v1/sms/service/${service_id}/joborder`, data);
	const res = await request<ApiRequest<JobOrderWithDetails[]>>(
		'GET',
		`/api/v1/sms/service/${service_id}/joborder`,
	);
	return res.data[0] as JobOrderWithDetails;
};

export const UpdateJobOrder = async (
	data: Joborder,
	service_id: string,
	joborder_id: number,
): Promise<JobOrderWithDetails> => {
	// Don't use try catch here
	// Insert Saving Logic here

	// Update Request
	await request(
		'PUT',
		`/api/v1/sms/service/${service_id}/joborder/${joborder_id}`,
		data,
	);
	// Get updated data request
	const res = await request<ApiRequest<JobOrderWithDetails[]>>(
		'GET',
		`/api/v1/sms/service/${service_id}/joborder/${joborder_id}`,
	);
	return res.data[0] as JobOrderWithDetails;
};

export const DeleteJobOrder = async (data: number): Promise<void> => {
	// Don't use try catch here
	// Insert Saving Logic here
	console.log(data);
};
