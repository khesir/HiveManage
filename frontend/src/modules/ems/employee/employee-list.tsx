import {useState, useEffect} from 'react';
import {EmployeeTable} from './employee-table';
import {columns} from './columns';
import {PaginationResponse, request} from '@/api/axios';
import {EmployeeRolesWithDetails} from '../_components/validation/employeeRoles';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function EmployeeList({searchParams}: paramsProps) {
	const [employees, setEmployees] = useState<EmployeeRolesWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const status = searchParams.get('status') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	const fullname = searchParams.get('fullname') || undefined;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<EmployeeRolesWithDetails>>(
				'GET',
				`/api/v1/ems/employeeRoles?limit=${pageLimit}&offset=${offset}` +
					(status ? `&status=${status}` : '') +
					(sort ? `&sort=${sort}` : '') +
					(fullname ? `&fullname=${fullname}` : ''),
			);
			setEmployees(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status, fullname]);

	return (
		<EmployeeTable
			searchKey="fullname"
			columns={columns}
			data={employees}
			pageCount={pageCount}
		/>
	);
}
