import {Reservation} from '@/lib/sales-zod-schema';

export const CreateReservation = async (
	data: Reservation,
): Promise<Reservation> => {
	// Don't use try catch here
	// Insert Saving Logic here
	console.log(data);
	return {} as Reservation;
};
