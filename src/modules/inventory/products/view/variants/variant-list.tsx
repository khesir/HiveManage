import {PaginationResponse, request} from '@/api/axios';
import {ProductVariantSupplier} from '@/modules/inventory/_components/validation/variant-supplier';
import {useState, useEffect} from 'react';
import {VariantTable} from './variant-table';
import {columns} from './columns';
import {useParams} from 'react-router-dom';

interface productVariantsProps {
	searchParams: URLSearchParams;
	product_id: string;
}

export default function VariantList({
	searchParams,
	product_id,
}: productVariantsProps) {
	const [pageCount, setPageCount] = useState<number>(0);
	const [productVariants, setProductVariants] = useState<
		ProductVariantSupplier[]
	>([]);
	const {id} = useParams();
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchProducts = async () => {
			const inventoryResponse = await request<
				PaginationResponse<ProductVariantSupplier>
			>(
				'GET',
				`/api/v1/ims/product/${product_id}/prodvarsupp?limit=${pageLimit}&offset=${offset}`,
			);
			setProductVariants(inventoryResponse.data);
			setPageCount(Math.ceil(inventoryResponse.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit]);
	console.log(productVariants);
	return (
		<VariantTable
			searchKey={''}
			columns={columns}
			data={productVariants}
			pageCount={pageCount}
		/>
	);
}
