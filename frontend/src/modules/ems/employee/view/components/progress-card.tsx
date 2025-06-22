import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
	showboth?: boolean;
}
export function ProgressCard({selectedEmployee, showboth = false}: Props) {
	return (
		<>
			{(selectedEmployee.employee.position.name === 'Technician' ||
				showboth) && (
				<Card x-chunk="dashboard-05-chunk-1">
					<CardHeader className="pb-2">
						<CardDescription>Total Handled Joborders</CardDescription>
						<CardTitle className="text-4xl">12</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-xs text-muted-foreground">
							3 currently inprogress
						</div>
					</CardContent>
				</Card>
			)}
			{(selectedEmployee.employee.position.name === 'Sales' || showboth) && (
				<Card x-chunk="dashboard-05-chunk-1">
					<CardHeader className="pb-2">
						<CardDescription>Total Sales</CardDescription>
						<CardTitle className="text-4xl">12</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-xs text-muted-foreground">
							10 sales made today
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}
