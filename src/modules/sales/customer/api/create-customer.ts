import {Customer} from '@/lib/cms-zod-schema';

export const CreateCustomer = async (data: Customer) => {
	// Don't use try catch here
	console.log(data);
};
