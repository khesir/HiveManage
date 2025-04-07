import {SalesItemWithDetails} from '@/lib/sales-zod-schema';
import {create} from 'zustand';

interface SalesItemWithDetailStore {
	selectedSalesItemWithDetails: SalesItemWithDetails[];
	setSelectedSalesItemWithDetails: (items: SalesItemWithDetails[]) => void;
	resetItemWithDetails: () => void;
}

export const useSalesItemWithDetailsStore = create<SalesItemWithDetailStore>(
	(set) => ({
		selectedSalesItemWithDetails: [],
		setSelectedSalesItemWithDetails: (data: SalesItemWithDetails[]) =>
			set({selectedSalesItemWithDetails: data}),
		resetItemWithDetails: () => set({selectedSalesItemWithDetails: []}),
	}),
);
