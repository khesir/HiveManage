import {useEffect, useState} from 'react';
import {PayrollTable} from './payroll-table';
import {payrollColumn} from './columns';
import {PaginationResponse, request} from '@/api/axios';
import {Payroll} from '@/lib/employee-zod-schema';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function PayrollList({searchParams}: paramsProps) {
	const [payroll, setPayroll] = useState<Payroll[]>([]);
	const [totalData, setTotalData] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;
	const status = searchParams.get('status') || null;

	useEffect(() => {
		const fetchPayrollData = async () => {
			const res = await request<PaginationResponse<Payroll>>(
				'GET',
				`/api/v1/ems/payrolls?limit=${pageLimit}&offset=${offset}` +
					(status ? `&status=${status}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);

			console.log(res);
			setPayroll(res.data);
			setTotalData(res.total_data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchPayrollData();
	}, [offset, pageLimit, sort]);

	return (
		<PayrollTable
			pageNo={page}
			columns={payrollColumn}
			totalUsers={totalData}
			data={payroll}
			pageCount={pageCount}
		/>
	);
}
