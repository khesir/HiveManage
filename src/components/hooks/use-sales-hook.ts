import {create} from 'zustand';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SalesHook {
	salesHookData: {
		[key: string]: any[]; // Allows for dynamic keys and arrays as values
	};
	setSaleHookData: (
		type: string,
		data?: any[],
		action?: 'append' | 'remove' | 'clear' | 'reset',
	) => void;
}
export const useSalesHook = create<SalesHook>((set) => ({
	salesHookData: {}, // Initialize as an empty object
	setSaleHookData: (type, data = [], action = 'append') =>
		set((state) => {
			const existingData = state.salesHookData[type] || [];

			let updatedData;
			switch (action) {
				case 'append':
					// Append new data
					updatedData = {
						...state.salesHookData,
						[type]: [...(existingData || []), ...data],
					};
					break;
				case 'remove':
					updatedData = {
						...state.salesHookData,
						[type]: existingData.filter(
							(item) =>
								// This finds the matching id where item_id is equal and check if type is equal
								// Then remove it by !
								!data.some(
									(d) =>
										d.data.item_id === item.data.item_id &&
										d.data.type === item.data.type,
								),
						),
					};
					break;
				case 'clear':
					// Clear all items for the specified type and set new data if provided
					updatedData = {
						...state.salesHookData,
						[type]: data.length > 0 ? data : [], // Use new data if provided, else clear
					};
					break;
				case 'reset':
					// Reset all data in salesHookData
					updatedData = {};
					break;
				default:
					updatedData = state.salesHookData;
			}

			return {salesHookData: updatedData};
		}),
}));
