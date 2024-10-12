import {ApiRequest, request} from '@/api/axios';
import useConfirmStore from '@/components/hooks/use-confirm-store';
import useEmployeeFormStore from '@/components/hooks/use-create-employee-view';
import {Button} from '@/components/ui/button';
import {EmployeeBasicInformation} from '@/lib/zod-schema';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function CreateEmployeeProcess() {
	const navigate = useNavigate();
	const {status, setStatus} = useConfirmStore();
	const {data} = useEmployeeFormStore();
	const [message, setMessage] = useState<string>('');
	const [view, setView] = useState<boolean>(false);

	useEffect(() => {
		const processEmployeeData = async () => {
			try {
				// 1. Create Employee
				await sleep(3000);
				await request(
					'POST',
					'/api/v1/ems/employees',
					data?.employeeBasicInformation,
				);
				console.log('Employee Creation Passed');

				// Fetch new Created Employee
				await sleep(3000);
				setMessage('Employee created successfully.');
				const response = await request<ApiRequest<EmployeeBasicInformation>>(
					'GET',
					'/api/v1/ems/employees?sort=desc&limit=1',
				);
				setMessage('Fetching new Created employee');
				console.log('Fetching employee Passed');

				// 2. Create Personal Information
				await sleep(3000);
				await request(
					'POST',
					`/api/v1/ems/employees/${(response.data as EmployeeBasicInformation[])[0].employee_id}/personalInformation`,
					data?.personalInformation,
				);
				setMessage('Personal Information created successfully.');
				console.log('Personal Information Creation Passed');

				// 3. Create Employment Information
				await sleep(3000);
				await request(
					'POST',
					`/api/v1/ems/employees/${(response.data as EmployeeBasicInformation[])[0].employee_id}/employmentInformation`,
					{
						department_id: Number(data?.employmentInformation.department_id),
						designation_id: Number(data?.employmentInformation.designation_id),
						employee_type: data?.employmentInformation.employee_type,
						employee_status: data?.employmentInformation.employee_status,
					},
				);
				setMessage('Employment Information created successfully.');
				console.log('Employment Information Creation Passed');

				// 4. Create Salary Information
				await sleep(3000);
				await request(
					'POST',
					`/api/v1/ems/employees/${(response.data as EmployeeBasicInformation[])[0].employee_id}/salaryInformation`,
					{
						payroll_frequency: data?.salaryInformation.payroll_frequency,
						base_salary: Number(data?.salaryInformation.base_salary),
					},
				);
				setMessage('Salary Information created successfully.');
				console.log('Salary Information Creation Passed');

				// 5. Create Financial Information
				await sleep(3000);
				await request(
					'POST',
					`/api/v1/ems/employees/${(response.data as EmployeeBasicInformation[])[0].employee_id}/financialInformation`,
					data?.financialInformation,
				);
				setMessage('Financial Information created successfully.');
				console.log('Financial Information Creation Passed');

				await sleep(5000);
				setMessage('Sucessfully Creating Employee');
				setView(true);
				setMessage('Press Continue to proceed');
			} catch (error) {
				console.log(error);
				if (error instanceof Error) {
					setMessage(error.message);
				} else {
					setMessage('An unknown error occurred');
				}
			} finally {
				setStatus(true);
			}
		};

		if (status) {
			processEmployeeData();
		}
	}, [status, data, setStatus]);
	const handleClick = async () => {
		setStatus(false);
		navigate('/admin/ems/overview');
	};
	return (
		<>
			{status ? (
				<div>
					{/* Render component when data is true */}
					<h1>{message}</h1>
					{/* You can add more components or logic here */}
				</div>
			) : (
				<div>
					{/* Render component when data is false */}
					<h1>Press Confirm</h1>
					{/* You can add more components or logic here */}
				</div>
			)}
			{view && (
				<>
					<Button onClick={handleClick}>Continue</Button>
				</>
			)}
		</>
	);
}

function sleep(ms: number | undefined) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
