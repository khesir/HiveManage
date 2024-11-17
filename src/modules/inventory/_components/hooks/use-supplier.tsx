import {create} from 'zustand';
import {SupplierWithRelatedData} from '../validation/supplier';

type PropsProps = {
	data: SupplierWithRelatedData | null;
	setSupplier: (newData: SupplierWithRelatedData) => void;
};

const useSupplierStore = create<PropsProps>((set) => ({
	data: null,
	setSupplier: (newData: SupplierWithRelatedData) =>
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
