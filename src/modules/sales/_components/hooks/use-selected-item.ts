import {ProductWithRelatedTables} from '@/components/validation/product';
import {create} from 'zustand';

interface ProductWithRelatedDataStore {
	selectedProductWithRelatedData: ProductWithRelatedTables[];
	setSelectedProductWithRelatedData: (
		product: ProductWithRelatedTables[],
	) => void;
	addProductWithRelatedData: (product: ProductWithRelatedTables) => void;
	removeProductWithRelatedData: (id: number) => void;
}

export const useProductWithRelatedDataStore =
	create<ProductWithRelatedDataStore>((set) => ({
		selectedProductWithRelatedData: [],
		setSelectedProductWithRelatedData: (data) =>
			set({selectedProductWithRelatedData: data}),
		addProductWithRelatedData: (product) =>
			set((state) => ({
				selectedProductWithRelatedData: [
					...state.selectedProductWithRelatedData,
					product,
				], // Add a new product to the array
			})),
		removeProductWithRelatedData: (id) =>
			set((state) => ({
				selectedProductWithRelatedData:
					state.selectedProductWithRelatedData.filter(
						(product) => product.product_id !== id,
					),
			})),
	}));
