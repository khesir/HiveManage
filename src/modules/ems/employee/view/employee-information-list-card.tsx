import {Card} from '@/components/ui/card';
import {useEmployeeStore} from '../../_components/hooks/use-employee-story';
import {Button} from '@/components/ui/button';
import {Moon, Sun} from 'lucide-react';
import {EmployeeRecentActivity} from './employee-recent-activity';
import {EmployeInforTabs} from './info-card/employee-tabs';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {EmployeeRolesWithDetails} from '../../_components/validation/employeeRoles';
import {PaginationResponse, request} from '@/api/axios';

export function EmployeeInformationListCard() {
	const {selectedEmployee, setSelectedEmployee} = useEmployeeStore();
	const [loading, setLoading] = useState<boolean>(false);
	const {id} = useParams();
	console.log(id);
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const empRoleData = await request<
					PaginationResponse<EmployeeRolesWithDetails>
				>('GET', `/api/v1/ems/employee-roles?employee_id=${id}`);
				setSelectedEmployee(empRoleData.data[0]);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	if (loading) {
		return <Card>Fetching data</Card>;
	}
	if (!selectedEmployee) {
		return <Card>Something went wrong, trying again</Card>;
	}
	return (
		<div className="flex gap-5 flex-col sm:flex-row">
			<div className="space-y-3 flex-1">
				<div className="flex gap-5 h-[300px]">
					<div className="max-h-full flex-1 ">
						<EmployeInforTabs selectedEmployee={selectedEmployee} />
					</div>

					<div className="relative w-[300px] h-full">
						<div className="overflow-hidden rounded-md h-[300px]">
							<img
								src={
									selectedEmployee?.employee.profile_link
										? selectedEmployee?.employee.profile_link
										: `https://api.dicebear.com/7.x/lorelei/svg?seed=${selectedEmployee?.employee.firstname}`
								}
								alt="Selected profile"
								className="object-cover w-full h-full"
							/>
						</div>
						<div className="absolute bottom-5 -right-2">
							{selectedEmployee.status === 'Online' ? (
								<Button className="w-[200px] bg-green-500 text-white justify-start flex hover:bg-green-400 items-center gap-2">
									<Sun className="h-5 w-5" /> Online
								</Button>
							) : (
								<Button className="w-[200px] bg-slate-500 text-white justify-start flex hover:bg-slate-400 items-center gap-2">
									<Moon className="h-5 w-5" /> Offline
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="flex-0 w-full sm:w-[400px]">
				<EmployeeRecentActivity selectedEmployee={selectedEmployee} />
			</div>
		</div>
	);
}
