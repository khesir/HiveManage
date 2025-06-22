import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {PaginationResponse, request} from '@/api/axios';

import {OrderLogs} from '@/components/interface/logs';
import {OrderLogsTable} from './logs-table';
import {columns} from './logs-column';

export function LogsTabOrder() {
	const {id} = useParams();
	const [searchParams] = useSearchParams();
	const [OrderLogs, setOrderLogs] = useState<OrderLogs[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchData = async () => {
			const newProductData = await request<PaginationResponse<OrderLogs>>(
				'GET',
				`/api/v1/logs/orderlogs?order_id=${id}&limit=${pageLimit}&offest=${offset}`,
			);
			setOrderLogs(newProductData.data);
			setPageCount(Math.ceil(newProductData.total_data / pageLimit));
		};
		fetchData();
	}, [offset, pageLimit]);
	return (
		<OrderLogsTable columns={columns} data={OrderLogs} pageCount={pageCount} />
	);
}
