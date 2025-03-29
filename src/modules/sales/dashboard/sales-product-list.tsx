import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {Product} from '../../../components/validation/inventory/product';
import {useSearchParams} from 'react-router-dom';
import {Category} from '@/components/validation/inventory/category';
import {columns} from './sales-product-columns';
import {SalesProductTable} from './sales-product-table';

export default function SalesProductList() {
	const [searchParams] = useSearchParams();
	const [pageCount, setPageCount] = useState<number>(0);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	const category_id = Number(searchParams.get('category_id')) || undefined;
	const product_name = searchParams.get('product_name') || undefined;

	useEffect(() => {
		const fetchProducts = async () => {
			const [categoryResponse, productResponse] = await Promise.all([
				request<PaginationResponse<Category>>(
					'GET',
					`/api/v1/ims/category?no_pagination=true`,
				),
				request<PaginationResponse<Product>>(
					'GET',
					`/api/v1/ims/product?limit=${pageLimit}&offset=${offset}` +
						(sort ? `&sort=${sort}` : '') +
						(category_id ? `&category_id=${category_id}` : '') +
						(product_name ? `&product_name=${product_name}` : ''),
				),
			]);
			setCategories(categoryResponse.data);
			setProducts(productResponse.data);
			setPageCount(Math.ceil(productResponse.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, sort, category_id, product_name]);

	return (
		<SalesProductTable
			columns={columns}
			categories={categories}
			data={products}
			searchKey={'name'}
			pageCount={pageCount}
		/>
	);
}
