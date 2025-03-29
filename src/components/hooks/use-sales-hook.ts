import {create} from 'zustand';
import {toast} from 'sonner';
import {BatchItem} from '../validation/inventory/batch-items';
import {SerializeItem} from '../validation/inventory/serialize-items';

type Product = BatchItem | SerializeItem;

interface SalesItem {
	product_id: number;
	quantity: number;
	record: Product;
}
interface SalesHook {
	salesHookData: SalesItem[];
	trigger: boolean;
	addProduct: (product: Product, quantity: number) => void;
	removeProduct: (id: number) => void;
	resetProducts: () => void;
}

export const useSalesHook = create<SalesHook>((set) => ({
	salesHookData: [],
	trigger: false,

	addProduct: (product, quantity) =>
		set((state) => {
			const exists = state.salesHookData.some(
				(p) => p.product_id === product.product_id, // Assuming `Product` has an `id` field
			);
			if (exists) {
				toast.error(`Product with id ${product.product_id} already exists.`);
				return state;
			}

			const salesItem: SalesItem = {
				product_id: product.product_id,
				quantity: quantity,
				record: product,
			};

			return {
				salesHookData: [...state.salesHookData, salesItem],
				trigger: !state.trigger,
			};
		}),

	removeProduct: (id) =>
		set((state) => {
			const exists = state.salesHookData.some((p) => p.product_id === id);
			if (!exists) {
				toast.error(`Product with id ${id} does not exist.`);
				return state;
			}

			return {
				salesHookData: state.salesHookData.filter((p) => p.product_id !== id),
				trigger: !state.trigger,
			};
		}),

	resetProducts: () =>
		set((state) => ({
			salesHookData: [],
			trigger: !state.trigger,
		})),
}));
