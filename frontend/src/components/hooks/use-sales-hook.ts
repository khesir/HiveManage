import {create} from 'zustand';
import {toast} from 'sonner';
import {SerializeItem} from '../validation/serialize-items';
import {Product} from '../validation/product';

export interface SalesItem {
	quantity: number;
	is_serialize: boolean;
	sold_price: number;
	data: Product;
	serializeData: SerializeItem[];
}
interface SalesHook {
	salesHookData: SalesItem[];
	trigger: boolean;
	getSalesItemByProductId: (product_id: number) => SalesItem | null;
	addProduct: (
		product: Product,
		quantity: number,
		is_serialize: boolean,
		serializedItems: SerializeItem[],
	) => void;
	updateQuantity: (index: number, quantity: number) => void;
	removeProduct: (id: number) => void;
	resetProducts: () => void;
}

export const useSalesHook = create<SalesHook>((set, get) => ({
	salesHookData: [],
	trigger: false,

	getSalesItemByProductId: (product_id: number) =>
		get().salesHookData.find((item) => item.data.product_id === product_id) ||
		null,

	addProduct: (
		product,
		quantity,
		is_serialize,
		serializedItems: SerializeItem[] = [],
	) =>
		set((state) => {
			const exists = state.salesHookData.some(
				(p) => p.data.product_id === product.product_id,
			);
			if (exists) {
				toast.error(`Product with id ${product.product_id} already exists.`);
				return state;
			}

			if (is_serialize) {
				const salesItem: SalesItem = {
					is_serialize: true,
					quantity: quantity,
					sold_price: product.selling_price || 0,
					data: product,
					serializeData: serializedItems,
				};

				return {
					salesHookData: [...state.salesHookData, salesItem],
					trigger: !state.trigger,
				};
			} else {
				const salesItem: SalesItem = {
					is_serialize: false,
					quantity: quantity,
					sold_price: product.selling_price || 0,
					data: product,
					serializeData: [],
				};

				return {
					salesHookData: [...state.salesHookData, salesItem],
					trigger: !state.trigger,
				};
			}
		}),

	updateQuantity: (index, quantity) =>
		set((state) => {
			if (index < 0 || index >= state.salesHookData.length) {
				toast.error(`Invalid index ${index}.`);
				return state;
			}

			if (isNaN(quantity) || quantity < 1) {
				return state;
			}

			const currentItem = state.salesHookData[index];
			if (quantity > (currentItem.data.selling_price || 0)) {
				return state;
			}

			const updatedSalesHookData = [...state.salesHookData];
			updatedSalesHookData[index] = {
				...updatedSalesHookData[index],
				quantity: quantity,
			};

			return {
				salesHookData: updatedSalesHookData,
				trigger: !state.trigger,
			};
		}),

	removeProduct: (id) =>
		set((state) => {
			const exists = state.salesHookData.some((p) => p.data.product_id === id);
			if (!exists) {
				toast.error(`Product with id ${id} does not exist.`);
				return state;
			}

			return {
				salesHookData: state.salesHookData.filter(
					(p) => p.data.product_id !== id,
				),
				trigger: !state.trigger,
			};
		}),

	resetProducts: () =>
		set((state) => ({
			salesHookData: [],
			trigger: !state.trigger,
		})),
}));
