import {Task} from '../../../joborder/_components/validation/task';
import {ItemWithDetails} from '@/modules/inventory/_components/validation/product';

export const SubmitTicket = async (
	formdata: Task,
	remarkItems: ItemWithDetails[],
) => {
	console.log(formdata);
	console.log(remarkItems);
};
