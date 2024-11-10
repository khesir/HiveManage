import {useEffect, useState} from 'react';

import {PayrollEmployeeTable} from './payroll-employee-table';
import {ColumnDef} from '@tanstack/react-table';
import {OnPayrollJoin} from '@/modules/ems/_components/validation/custom-validation';
import {usePayrollStore} from '@/components/hooks/use-payroll-store';
import {ApiRequest, request} from '@/api/axios';

export const payrollColumn: ColumnDef<OnPayrollJoin>[] = [
	{
		// Custom accessor to combine first_name, middle_name, last_name
		id: 'fullname',
		header: 'NAME',
		accessorFn: (row) =>
			`${row.employee.firstname} ${row.employee.middlename ? row.employee.middlename + ' ' : ''}${row.employee.lastname}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		id: 'approval_status',
		header: 'Status',
		accessorFn: (row) => row.payroll_approval?.approval_status || 'N/A',
		cell: (info) => info.getValue(),
	},
];

export function PayrollEmployeeList() {
	const {selectedPayroll} = usePayrollStore();
	const [onPayroll, setOnPayroll] = useState<OnPayrollJoin[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const onPayroll = async () => {
			setLoading(true);

			try {
				const data = await request<ApiRequest<OnPayrollJoin[]>>(
					'GET',
					`/api/v1/ems/payrolls/${selectedPayroll?.payroll_id}/onPayroll`,
				);
				console.log(data);
				setOnPayroll((data.data as OnPayrollJoin[]) || null);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		onPayroll();
	}, [selectedPayroll]);

	return (
		<>
			{loading ? (
				<div>Fetching data...</div>
			) : onPayroll ? (
				<PayrollEmployeeTable columns={payrollColumn} data={onPayroll} />
			) : (
				<div>No data available</div> // Display message when no data
			)}
		</>
	);
}
