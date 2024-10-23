import {useState, useEffect} from 'react';
import {columns} from './columns';
import {PaginationResponse, request} from '@/api/axios';
import {Customer} from '@/lib/cms-zod-schema';
import {CustomerTable} from './customer-table';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function CustomerList({searchParams}: paramsProps) {
	const [customer, setCustomer] = useState<Customer[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const status = searchParams.get('status') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<Customer>>(
				'GET',
				`/api/v1/cms/customer?limit=${pageLimit}&offset=${offset}` +
					(status ? `&status=${status}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setCustomer(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	return (
		<CustomerTable
			searchKey="fullname"
			columns={columns} // Define your `columns` somewhere in the component or import them
			data={customer}
			pageCount={pageCount}
		/>
	);
}
