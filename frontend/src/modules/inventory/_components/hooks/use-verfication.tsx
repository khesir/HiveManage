import {create} from 'zustand';

interface ConfirmStore {
	status: boolean; // Boolean state
	setStatus: (status: boolean) => void; // Method to update the status
}

// Create the Zustand store
const useVerification = create<ConfirmStore>((set) => ({
	status: false, // Initial status
	setStatus: (status: boolean) => set({status}), // Update status
}));

export default useVerification;
