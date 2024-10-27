import {PaginationResponse, request} from '@/api/axios';
import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {useState, useEffect} from 'react';
import {ServiceTable} from './service_table';
import {columns} from './columns';

export type paramsProps = {
	isDetails?: boolean;
	searchParams: URLSearchParams;
	customer_id?: number;
	service_status?: string;
};

export default function ServiceList({
	searchParams,
	isDetails,
	customer_id,
	service_status,
}: paramsProps) {
	const [service, setService] = useState<ServiceWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const status = searchParams.get('service_status') || service_status || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;
	const customer =
		Number(searchParams.get('customer_id')) || customer_id || undefined;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<ServiceWithDetails>>(
				'GET',
				`/api/v1/sms/service?sort=desc&limit=${pageLimit}&offset=${offset}` +
					(status ? `&service_status=${status}` : '') +
					(sort ? `&sort=${sort}` : '') +
					(customer ? `&customer_id=${customer}` : ''),
			);
			setService(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);
	return (
		<ServiceTable
			columns={columns}
			data={service}
			pageCount={pageCount}
			isDetails={isDetails}
		/>
	);
}
