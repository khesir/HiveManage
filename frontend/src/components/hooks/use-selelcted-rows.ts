/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from 'zustand';

interface SelectedRowsState {
	selectedDataByType: {
		[key: string]: any[];
	};
	setSelectedData: (type: string, data: any[]) => void;
}

export const useSelectedRowsStore = create<SelectedRowsState>((set) => ({
	selectedDataByType: {},
	setSelectedData: (type, data) =>
		set((state) => ({
			selectedDataByType: {
				...state.selectedDataByType,
				[type]: data,
			},
		})),
}));
