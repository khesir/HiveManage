import {Card, CardHeader, CardTitle} from '@/components/ui/card';
import {LogListMini} from '@/modules/auditlogs/logList-mini';
import {EmployeeRolesWithDetails} from '../../_components/validation/employeeRoles';
import {ProgressCard} from './components/progress-card';
interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}
export function EmployeeRecentActivity({selectedEmployee}: Props) {
	return (
		<div className="flex flex-col gap-5">
			<ProgressCard
				selectedEmployee={selectedEmployee}
				showboth={
					selectedEmployee.employee.position.name === 'Admin' ? true : false
				}
			/>
			<Card x-chunk="dashboard-01-chunk-5" className="h-[600px]">
				<CardHeader>
					<CardTitle>Recent Activities</CardTitle>
				</CardHeader>
				<LogListMini employee_id={selectedEmployee.employee.employee_id} />
			</Card>
		</div>
	);
}
