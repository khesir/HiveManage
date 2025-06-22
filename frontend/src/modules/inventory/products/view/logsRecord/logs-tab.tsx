import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {PaginationResponse, request} from '@/api/axios';

import {ProductLogs} from '@/components/interface/logs';
import {ProductLogsTable} from './logs-table';
import {columns} from './logs-column';

export function LogsTabProduct() {
	const {id} = useParams();
	const [searchParams] = useSearchParams();
	const [productLogs, setProductLogs] = useState<ProductLogs[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchData = async () => {
			const newProductData = await request<PaginationResponse<ProductLogs>>(
				'GET',
				`/api/v1/logs/productlogs?product_id=${id}&limit=${pageLimit}&offest=${offset}`,
			);
			setProductLogs(newProductData.data);
			setPageCount(Math.ceil(newProductData.total_data / pageLimit));
		};
		fetchData();
	}, [offset, pageLimit]);
	return (
		<ProductLogsTable
			columns={columns}
			data={productLogs}
			pageCount={pageCount}
		/>
	);
}
