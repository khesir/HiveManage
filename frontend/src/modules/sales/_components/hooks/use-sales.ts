import {Sales} from '@/components/validation/sales';
import {create} from 'zustand';

type SalesProps = {
	data: Sales | null;
	setSale: (newData: Sales) => void;
	resetSales: () => void;
};

const useSales = create<SalesProps>((set) => ({
	data: null,
	setSale: (newData: Sales) =>
		set(() => ({
			data: newData,
		})),
	resetSales: () => set({data: null}),
}));

export default useSales;
