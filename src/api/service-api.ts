import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {ApiRequest, request} from './axios';
import {Sales} from '@/components/validation/sales';
import {Service} from '@/components/validation/service';

export const CreateService = async (serviceData: Service): Promise<void> => {
	try {
		await request<ApiRequest<Sales>>(
			'POST',
			`/api/v1/sms/service`,
			serviceData,
		);
		toast.success('Successfully recorded sales');
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
