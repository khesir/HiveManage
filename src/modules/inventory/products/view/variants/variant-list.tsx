import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {VariantTable} from './variant-table';
import {columns} from './columns';
import useTrackReferesh from '@/modules/inventory/_components/hooks/uset-track-refresh';
import {ProductVariant} from '@/modules/inventory/_components/validation/variants';

interface productVariantsProps {
	searchParams: URLSearchParams;
	product_id: string;
}

export default function VariantList({
	searchParams,
	product_id,
}: productVariantsProps) {
	const [pageCount, setPageCount] = useState<number>(0);
	const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
	const {track} = useTrackReferesh();
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchProducts = async () => {
			const inventoryResponse = await request<
				PaginationResponse<ProductVariant>
			>(
				'GET',
				`/api/v1/ims/product/${product_id}/variant?limit=${pageLimit}&offset=${offset}`,
			);
			console.log(inventoryResponse.data);
			setProductVariants(inventoryResponse.data);
			setPageCount(Math.ceil(inventoryResponse.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, track]);
	return (
		<VariantTable
			searchKey={''}
			columns={columns}
			data={productVariants}
			pageCount={pageCount}
		/>
	);
}
