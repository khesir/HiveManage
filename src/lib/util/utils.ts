import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {format, parseISO} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function generateCustomID(idLength: number) {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let id = '';

	for (let i = 0; i < idLength; i++) {
		id += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return id;
}

export function generateCustomUUID() {
	const today = new Date();

	// Extract year, day, and month
	const year = today.getFullYear();
	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');

	// Generate the custom ID
	const customID = generateCustomID(5);

	// Construct the final UUID pattern
	const finalUUID = `${year}-${day}-${month}-${customID}`;

	return finalUUID;
}

export function dateParser(isoString: string): string {
	try {
		// Parse the ISO string into a Date object
		const date = parseISO(isoString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			console.error('Invalid date:', isoString);
			return 'Invalid Date';
		}

		// Format the date into a human-readable string
		const formattedDate = format(date, 'MMMM dd, yyyy');
		return formattedDate;
	} catch (error) {
		console.error('Error parsing date:', isoString, error);
		return 'Invalid Date';
	}
}
export const formatDate = (date: string) => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
	const day = String(d.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};