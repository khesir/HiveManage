import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {ApiRequest, request} from './axios';
import {Customer} from '@/components/validation/customer';
import {Payment} from '@/components/validation/payment';
import {Sales} from '@/components/validation/sales';
import {SalesItem} from '@/components/hooks/use-sales-hook';

export const CreateSales = async (
	items: SalesItem[],
	customer: Customer | null,
	payment: Payment,
	employee_id: number,
): Promise<Sales | undefined> => {
	try {
		const salesData = {
			status: 'Completed',
			handled_by: employee_id,
			customer: customer || undefined,
			salesItems: items,
			payment: payment,
		};
		const res = await request<ApiRequest<Sales>>(
			'POST',
			`/api/v1/sms/sales`,
			salesData,
		);
		toast.success('Successfully recorded sales');
		return res.data as Sales;
	} catch (e) {
		if (e instanceof Error) {
			toast.error(e.toString());
		} else if (e instanceof AxiosError) {
			toast.error(e.response?.data as string);
		} else {
			toast.error('An unknown error occured');
		}
		console.log(e);
		return undefined;
	}
};
