import {create} from 'zustand';
import {ProductWithRelatedTables} from '../validation/product';

type PropsProps = {
	data: ProductWithRelatedTables | null;
	setProduct: (newData: Partial<ProductWithRelatedTables>) => void;
	resetProducts: () => void;
};

const useProducts = create<PropsProps>((set) => ({
	data: null,
	setProduct: (newData: Partial<ProductWithRelatedTables>) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as ProductWithRelatedTables,
		})),
	resetProducts: () => set({data: null}),
}));

export default useProducts;
