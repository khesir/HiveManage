import {Task} from '../validation/task';
import {ItemWithDetails} from '@/lib/inventory-zod-schema';

export const SubmitTicket = async (
	formdata: Task,
	remarkItems: ItemWithDetails[],
) => {
	console.log(formdata);
	console.log(remarkItems);
};
