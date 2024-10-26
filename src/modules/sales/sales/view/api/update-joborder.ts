import {ApiRequest, request} from '@/api/axios';
import {Joborder, JobOrderWithDetails} from '@/lib/sales-zod-schema';

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
