import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {ProductWithDetailsTable} from './product-table';
import {columns} from './columns';
import {Category} from '../_components/validation/category';
import {Product} from '../_components/validation/product';

interface ProductWithDetails {
	searchParams: URLSearchParams;
}

export default function ProductWithDetailsList({
	searchParams,
}: ProductWithDetails) {
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
			const [categoryRespoonce, productResponse] = await Promise.all([
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
			setCategories(categoryRespoonce.data);
			setProducts(productResponse.data);
			setPageCount(Math.ceil(productResponse.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, sort, category_id, product_name]);
	console.log(products);
	return (
		<ProductWithDetailsTable
			columns={columns}
			categories={categories}
			data={products}
			searchKey={'name'}
			pageCount={pageCount}
		/>
	);
}
