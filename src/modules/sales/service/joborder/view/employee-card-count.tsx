import {EmployeeAvatarCircles} from '@/components/ui/avatarcircles';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import {EmployeeBasicInformation} from '@/lib/employee-zod-schema';

interface EmployeeCardCountProps {
	employee: EmployeeBasicInformation[];
	children?: React.ReactNode;
}

export function EmployeeCardCount({
	employee,
	children,
}: EmployeeCardCountProps) {
	const maxVisibleAvatars = 5;

	const avatarUrls = employee.slice(0, maxVisibleAvatars);
	const totalEmployees = employee.length;
	const numPeople =
		totalEmployees > maxVisibleAvatars ? totalEmployees - maxVisibleAvatars : 0;
	return (
		<Card className="w-[40%] h-[180px]" x-chunk="dashboard-05-chunk-1">
			<CardHeader className="pb-2">
				<CardTitle>Employees</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-xs text-muted-foreground">
					{numPeople ? numPeople + avatarUrls.length : avatarUrls.length}{' '}
					employee is in this JO
				</div>
				<EmployeeAvatarCircles employees={employee} />
			</CardContent>
			<CardFooter>{children}</CardFooter>
		</Card>
	);
}
