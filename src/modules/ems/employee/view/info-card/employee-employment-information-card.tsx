import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';

import {dateParser} from '@/lib/util/utils';
import {EmploymentInformationWithDetails} from '@/modules/ems/_components/validation/employee';

import {useEffect, useState} from 'react';

import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {Skeleton} from '@/components/ui/skeleton';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}

export function EmployeeEmploymentInformationCard({selectedEmployee}: Props) {
	const [employmentData, setEmploymentData] =
		useState<EmploymentInformationWithDetails>();
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee.employee_id) return; // Guard clause

		const fetchEmploymentData = async () => {
			setLoading(true);
			try {
				const response = await request<
					ApiRequest<EmploymentInformationWithDetails[]>
				>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee.employee_id}/employmentInformation`,
				);
				const data = response.data as EmploymentInformationWithDetails[];
				console.log(data);
				if (data.length > 0) {
					setEmploymentData(data[0]);
				} else {
					setEmploymentData(undefined);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		fetchEmploymentData();
	}, [selectedEmployee]);
	if (loading) {
		return <Skeleton className="w-full h-full" />;
	}
	return (
		<>
			{employmentData === undefined ? (
				<div className="flex justify-center h-full items-center">
					<Button>Add Employment Data</Button>
				</div>
			) : (
				<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Hire Date</span>
							<span>{dateParser(employmentData.hireDate)}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Department</span>
							<span>{employmentData.department.name}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Designation</span>
							<span>{employmentData.designation.title}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Employee_type</span>
							<span>{employmentData.employee_type}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Employment_status</span>
							<span>{employmentData.employee_status}</span>
						</li>
					</ul>
				</Card>
			)}
		</>
	);
}
