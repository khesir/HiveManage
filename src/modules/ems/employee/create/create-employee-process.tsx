import {Button} from '@/components/ui/button';
import useConfirmStore from '@/hooks/use-confirm-store';
import useEmployeeFormStore from '@/hooks/use-create-employee-view';
import {request} from '@/lib/api/axios';
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
				console.log(data?.basicInformation);
				await sleep(3000);
				// await request('POST', '/api/v1/ems/employee', data?.basicInformation);
				setMessage('Employee created successfully.');

				// Fetch new Created Employee
				await sleep(3000);
				setMessage('Fetching new Created employee');

				// 2. Create Personal Information
				console.log(data?.personalInformation);
				await sleep(3000);
				// await request(
				// 	'POST',
				// 	'/api/v1/ems/{}/personalInformation',
				// 	data?.personalInformation,
				// );
				setMessage('Personal Information created successfully.');

				// 3. Create Employment Information
				console.log(data?.employmentInformation);
				await sleep(3000);
				// await request(
				// 	'POST',
				// 	'/api/v1/ems/financialInformation',
				// 	data?.employmentInformation,
				// );
				setMessage('Employment Information created successfully.');

				// 4. Create Salary Information
				console.log(data?.salaryInformation);
				await sleep(3000);
				// await request('POST', '/api/v1/ems/financialInformation');
				setMessage('Salary Information created successfully.');

				// await request('POST', '/api/v1/ems/financialInformation');
				console.log(data?.financialInformation);
				await sleep(3000);
				setMessage('Financial Information created successfully.');
				setView(true);
				setMessage('Press Continue to proceed');
			} catch (error) {
				setMessage('An error occurred while processing employee data.');
				console.error(error);
			}
		};

		if (status) {
			processEmployeeData();
		}
	}, [status, data, setStatus]);
	const handleClick = async () => {
		setStatus(false);
		navigate('/ems/employees');
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
