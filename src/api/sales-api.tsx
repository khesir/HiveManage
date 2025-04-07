import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {ApiRequest, request} from './axios';
import {Customer} from '@/components/validation/customer';
import {Payment} from '@/components/validation/payment';
import {Sales} from '@/components/validation/sales';

type SalesItem = {
	product_id: number;
	quantity: number;
	total_price: number;
};

export const CreateSales = async (
	items: SalesItem[],
	customer: Customer | null,
	payment: Payment,
	employee_id: number,
): Promise<Sales | undefined> => {
	try {
		const orderedData: Sales = {
			status: 'Completed',
			handled_by: employee_id,
			customer: customer || undefined,
			salesItem: items,
			payment: payment,
		};
		console.log(customer);
		const res = await request<ApiRequest<Sales>>(
			'POST',
			`/api/v1/sms/sales`,
			orderedData,
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
