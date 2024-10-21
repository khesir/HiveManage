/* eslint-disable @typescript-eslint/no-unused-vars */
import {create} from 'zustand';

export interface ProcessData {
	message: string;
	value: number;
}
interface ProgressState {
	progressList: ProcessData[];
	setProgress: (progress: ProcessData) => void;
	resetProgress: () => void;
}
// Create Zustand store
export const useProgressStore = create<ProgressState>((set) => ({
	progressList: [{message: 'Processing', value: 0}], // Initial state
	// Update the progress list
	setProgress: (progress: ProcessData) =>
		set((_state) => ({
			progressList: [{...progress}],
		})),
	// Reset the progress
	resetProgress: () =>
		set(() => ({
			progressList: [{message: 'Processing', value: 0}],
		})),
}));
