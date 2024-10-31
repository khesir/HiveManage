import {create} from 'zustand';

interface AddFormStatus {
	addStatus: string; // Boolean state
	setAddStatus: (addStatus: string) => void; // Method to update the addStatus
}

// Create the Zustand store
const useAddFormStatus = create<AddFormStatus>((set) => ({
	addStatus: 'main', // Initial addStatus
	setAddStatus: (addStatus: string) => set({addStatus}), // Update addStatus
}));

export default useAddFormStatus;
