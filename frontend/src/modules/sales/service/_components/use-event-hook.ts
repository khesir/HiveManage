import {create} from 'zustand';

interface EventTriggerState {
	isTriggered: boolean;
	toggleTrigger: () => void;
}

const useEventTrigger = create<EventTriggerState>((set) => ({
	isTriggered: false,
	toggleTrigger: () => set((state) => ({isTriggered: !state.isTriggered})),
}));

export default useEventTrigger;
