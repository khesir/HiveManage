import {StockLogsWithDetails} from '@/modules/inventory/_components/validation/product';
import {create} from 'zustand';

type StockLogsWithDetailsFormStore = {
	data: StockLogsWithDetails | null;
	setStockLogs: (newData: Partial<StockLogsWithDetails>) => void;
	resetStockLogs: () => void;
};

const useStockLogsWithDetailsFormStore = create<StockLogsWithDetailsFormStore>(
	(set) => ({
		data: null,
		setStockLogs: (newData) =>
			set((state) => ({
				data: {...(state.data ?? {}), ...newData} as StockLogsWithDetails,
			})),
		resetStockLogs: () => set({data: null}),
	}),
);

export default useStockLogsWithDetailsFormStore;
