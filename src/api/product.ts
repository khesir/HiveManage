import {Product} from '@/components/validation/inventory/product';
import {AxiosError} from 'axios';
import {create} from 'zustand';
import {ApiRequest, PaginationResponse, request} from './axios';
import {ItemRecords} from '@/components/validation/inventory/item-record';
import {toast} from 'sonner';
import {ProductSupplier} from '@/components/validation/inventory/product-supplier';

type ProductState = {
	products: Product[];
	selectedProduct: Product;
	loading: boolean;
	totalData: number;

	fetchProducts: (params: URLSearchParams) => Promise<number | undefined>;
	getProductById: (productId: number) => Promise<Product | undefined>;
	addProduct: (newProduct: Omit<Product, 'id'>) => Promise<void>;
	updateProduct: (
		productId: number,
		suppplier_id: number,
		newProduct: ItemRecords,
	) => void;
	deleteProduct: (productId: number) => Promise<void>;
	updateItemRecords: (
		productId: number,
		item_record_id: number,
		newItem: ItemRecords,
	) => void;
	addProductSupplier: (
		productId: number,
		newProductSupplier: ProductSupplier,
	) => void;
	updateProductSupplier: (
		productId: number,
		productSupplierId: number,
		newProductSupplier: ProductSupplier,
	) => void;
	removeProductSupplier: (productId: number, productSupplierId: number) => void;
	finalize: (productId: number, itemrecordId: Product) => void;
};

const useProductStore = create<ProductState>((set) => ({
	products: [],
	selectedProduct: {} as Product,
	loading: false,
	totalData: 0,

	fetchProducts: async (params: URLSearchParams) => {
		set({loading: true});
		try {
			const page = Number(params.get('page')) || 1;
			const pageLimit = Number(params.get('limit')) || 10;
			const sort = params.get('sort') || null;
			const offset = (page - 1) * pageLimit;

			const category_id = Number(params.get('category_id')) || undefined;
			const product_name = params.get('product_name') || undefined;

			const response = await request<PaginationResponse<Product>>(
				'GET',
				`/api/v1/ims/product?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : '') +
					(category_id ? `&category_id=${category_id}` : '') +
					(product_name ? `&product_name=${product_name}` : ''),
			);
			set({products: response.data, totalData: response.total_data});
			return response.total_data;
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	getProductById: async (productId) => {
		set({loading: true});
		try {
			const response = await request<ApiRequest<Product>>(
				'GET',
				`/api/v1/ims/product/${productId}?includes=item_records,suppliers`,
			);
			let productData: Product;
			if (!Array.isArray(response.data)) {
				productData = response.data;
			} else {
				productData = response.data[0];
			}
			set((state) => ({products: [...state.products, productData as Product]}));
			set({selectedProduct: productData});
			return productData;
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	addProduct: async (newProduct: Product) => {
		set({loading: true});
		try {
			await request('POST', `api/v1/ims/product/`, {
				...newProduct,
				product_details: (newProduct.product_details ?? '').toString(),
				product_supplier_id: Number(newProduct.product_suppliers),
			});
			toast.success('Product Added');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	deleteProduct: async (productId) => {
		set({loading: true});
		try {
			await request('DELETE', `api/v1/ims/product/${productId}`);
			toast.success('Product Deleted');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	updateProduct: async (
		productId: number,
		supplier_id: number,
		newItem: ItemRecords,
	) => {
		set({loading: true});
		try {
			await request(
				'PUT',
				`/api/v1/ims/product/${productId}/orderProduct/${supplier_id}`,
				newItem,
			);
			toast.success('Product Item Updated successfully');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	updateItemRecords: async (
		productId: number,
		item_record_id: number,
		newItem: ItemRecords,
	) => {
		set({loading: true});
		try {
			await request(
				'PUT',
				`/api/v1/ims/order/${productId}/productRecord/${item_record_id}`,
				newItem,
			);
			toast.success('Item Record Updated successfully');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	addProductSupplier: async (
		productId: number,
		newProductSupplier: ProductSupplier,
	) => {
		set({loading: true});
		try {
			await request(
				'POST',
				`/api/v1/ims/product/${productId}/productSupplier`,
				newProductSupplier,
			);
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	updateProductSupplier: async (
		productId: number,
		productSupplierId: number,
		newProoductSupplier: ProductSupplier,
	) => {
		set({loading: true});
		try {
			await request(
				'PUT',
				`/api/v1/ims/product/${productId}/productSupplier/${productSupplierId}`,
				newProoductSupplier,
			);
			toast.success('Product Supplier Updated successfully');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},

	removeProductSupplier: async (
		productId: number,
		productsupplierId: number,
	) => {
		set({loading: true});
		try {
			await request(
				'DELETE',
				`/api/v1/ims/product/${productId}/productSupplier/${productsupplierId}`,
			);
			toast.success('Order item removed');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},

	finalize: async (productId: number, productData: Product) => {
		set({loading: true});
		try {
			// Just a temporary solution, For some reason after fetching data that is undefined
			// Is replaced as null
			await request(
				'POST',
				`/api/v1/ims/product/${productId}/finalize`,
				productData,
			);
			toast.success('Product has been added to records');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
}));

export default useProductStore;
