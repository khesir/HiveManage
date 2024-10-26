import {ApiRequest, request} from '@/api/axios';
import {Joborder, JobOrderWithDetails} from '@/lib/sales-zod-schema';

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
