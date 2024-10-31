import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {columns} from './columns';
import {StockLogsTable} from './stockts-table';
import {StockLogsWithDetails} from '@/lib/inventory-zod-schema';
import {useSearchParams} from 'react-router-dom';

export default function StockLogsList() {
	const [searchParams] = useSearchParams();
	const [stockLogs, setStockLogs] = useState<StockLogsWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<StockLogsWithDetails>>(
				'GET',
				`/api/v1/ims/stock-logs?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setStockLogs(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	return (
		<StockLogsTable columns={columns} data={stockLogs} pageCount={pageCount} />
	);
}
