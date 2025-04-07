import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {columns} from './columns';
import {SalesTable} from './sales-table';
import {Sales} from '@/components/validation/sales';

type Props = {
	isDetails?: boolean;
	searchParams: URLSearchParams;
	customer_id?: number;
	service_status?: string;
	employee_id?: number;
	isStaff?: boolean;
};

export default function ServiceList({searchParams}: Props) {
	const [service, setService] = useState<Sales[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<Sales>>(
				'GET',
				`/api/v1/sms/sales?sort=desc&limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setService(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort]);
	return <SalesTable columns={columns} data={service} pageCount={pageCount} />;
}
