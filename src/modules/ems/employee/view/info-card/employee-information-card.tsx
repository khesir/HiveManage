import {Card} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}

export function EmployeeInformationCard({selectedEmployee}: Props) {
	return (
		<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Firstname</span>
					<span>{selectedEmployee!.employee.firstname}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Middlename</span>
					<span>{selectedEmployee!.employee.middlename}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Lastname</span>
					<span>{selectedEmployee!.employee.lastname}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Position</span>
					<span>{selectedEmployee!.employee.position.name}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Role</span>
					<span>{selectedEmployee!.role.name}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Last Login</span>
					<span>
						{dateParser(selectedEmployee!.role.last_updated ?? '', true)}
					</span>
				</li>
			</ul>
		</Card>
	);
}
