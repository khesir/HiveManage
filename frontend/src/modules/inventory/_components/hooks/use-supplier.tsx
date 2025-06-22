import {Supplier} from '@/components/validation/supplier';
import {create} from 'zustand';

type PropsProps = {
	data: Supplier | null;
	setSupplier: (newData: Supplier) => void;
};

const useSupplierStore = create<PropsProps>((set) => ({
	data: null,
	setSupplier: (newData: Supplier) =>
		set((state) => {
			const updatedData = {...state.data, ...newData};

			// If categories are not provided in the new data, reset them
			if (!newData.categories) {
				updatedData.categories = [];
			}

			return {data: updatedData};
		}),
}));

export default useSupplierStore;
