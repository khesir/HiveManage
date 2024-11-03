import {Borrow} from '@/lib/sales-zod-schema';

export const CreateBorrow = async (data: Borrow): Promise<Borrow> => {
	// Don't use try catch here
	// Insert Saving Logic here
	console.log(data);
	return {} as Borrow;
};

export const UpdateBorrow = async (data: Borrow): Promise<Borrow> => {
	// Don't use try catch here
	// Insert Saving Logic here
	console.log(data);
	return {} as Borrow;
};

export const DeleteBorrow = async (data: number): Promise<void> => {
	// Don't use try catch here
	// Insert Saving Logic here
	console.log(data);
};
