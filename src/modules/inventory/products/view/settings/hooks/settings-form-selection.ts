import {create} from 'zustand';

interface SettingsFormSelection {
	settings: string;
	setSettings: (settings: string) => void;
}

// Create the Zustand store
const useSettingsFormSelection = create<SettingsFormSelection>((set) => ({
	settings: 'Profile',
	setSettings: (settings: string) => set({settings}),
}));

export default useSettingsFormSelection;
