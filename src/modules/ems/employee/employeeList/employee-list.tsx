import {useState, useEffect} from 'react';
import {EmployeeTable} from './employee-table';
import {columns} from './columns';
import {EmployeeBasicInformation} from '@/lib/zod-schema';
import {PaginationResponse, request} from '@/api/axios';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function EmployeeList({searchParams}: paramsProps) {
	const [employees, setEmployees] = useState<EmployeeBasicInformation[]>([]);
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const status = searchParams.get('status') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<EmployeeBasicInformation>>(
				'GET',
				`/api/v1/ems/employees?limit=${pageLimit}&offset=${offset}` +
					(status ? `&status=${status}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setEmployees(res.data);
			setTotalUsers(res.total_data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	return (
		<EmployeeTable
			searchKey="fullname"
			pageNo={page}
			columns={columns} // Define your `columns` somewhere in the component or import them
			totalUsers={totalUsers}
			data={employees}
			pageCount={pageCount}
		/>
	);
}
