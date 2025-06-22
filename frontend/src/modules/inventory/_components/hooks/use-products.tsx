import {create} from 'zustand';
import {Product} from '../../../../components/validation/product';

type PropsProps = {
	data: Product | null;
	setProduct: (newData: Partial<Product>) => void;
	resetProducts: () => void;
};

const useProducts = create<PropsProps>((set) => ({
	data: null,
	setProduct: (newData: Partial<Product>) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as Product,
		})),
	resetProducts: () => set({data: null}),
}));

export default useProducts;
