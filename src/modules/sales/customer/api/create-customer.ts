import {Customer} from '@/lib/cms-zod-schema';

export const CreateCustomer = async (data: Customer) => {
	try {
		// Request process
		console.log(data);
	} catch (error) {
		console.log(error);
	}
};
