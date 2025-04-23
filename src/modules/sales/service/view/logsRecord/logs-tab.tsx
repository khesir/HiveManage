import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {PaginationResponse, request} from '@/api/axios';

import {ServiceLogs} from '@/components/interface/logs';
import {ServiceLogsTable} from './logs-table';
import {columns} from './logs-column';

export function LogsTabProduct() {
	const {id} = useParams();
	const [searchParams] = useSearchParams();
	const [ServiceLogs, setServiceLogs] = useState<ServiceLogs[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchData = async () => {
			const newProductData = await request<PaginationResponse<ServiceLogs>>(
				'GET',
				`/api/v1/logs/serviceLogs?product_id=${id}&limit=${pageLimit}&offest=${offset}`,
			);
			setServiceLogs(newProductData.data);
			setPageCount(Math.ceil(newProductData.total_data / pageLimit));
		};
		fetchData();
	}, [offset, pageLimit]);
	return (
		<ServiceLogsTable
			columns={columns}
			data={ServiceLogs}
			pageCount={pageCount}
		/>
	);
}
