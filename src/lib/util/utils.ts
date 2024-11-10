/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function dateParser(
	isoString: string,
	includeTime: boolean = false,
): string {
	try {
		// Parse the ISO string into a Date object
		const date = parseISO(isoString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			console.error('Invalid date:', isoString);
			return 'Invalid Date';
		}

		// Determine the format based on includeTime
		const dateFormat = includeTime ? 'MMMM dd, yyyy hh:mm a' : 'MMMM dd, yyyy';
		const formattedDate = format(date, dateFormat);

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

export const formDataToObject = (formData: FormData): Record<string, any> => {
	const object: Record<string, any> = {};

	formData.forEach((value, key) => {
		if (value instanceof File) {
			object[key] = value;
		} else {
			if (object[key]) {
				if (Array.isArray(object[key])) {
					object[key].push(value);
				} else {
					object[key] = [object[key], value];
				}
			} else {
				object[key] = value;
			}
		}
	});

	return object;
};

export function appendFormData(
	data: Record<string, any>,
	formData: FormData,
): void {
	Object.keys(data).forEach((key) => {
		const value = data[key];

		if (value instanceof File) {
			formData.append(key, value);
			console.log(key);
			console.log(value);
		} else if (value instanceof FileList) {
			Array.from(value).forEach((file) => formData.append(key, file));
		} else if (typeof value === 'object' && value !== null) {
			formData.append(key, JSON.stringify(value));
		} else {
			formData.append(key, String(value));
		}
	});
	console.log(formData);
}
