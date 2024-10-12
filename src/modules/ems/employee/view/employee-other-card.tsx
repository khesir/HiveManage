import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';

export function EmployeeOtherCard() {
	return (
		<Card x-chunk="dashboard-05-chunk-3">
			<CardHeader className="px-7">
				<CardTitle>Others</CardTitle>
				<CardDescription>
					Overall collective employee information
				</CardDescription>
			</CardHeader>
			<CardContent>Payroll Information</CardContent>
		</Card>
	);
}
