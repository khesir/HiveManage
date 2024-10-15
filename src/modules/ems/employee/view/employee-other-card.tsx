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
			<CardContent>
				Extra informations. e.g.. Access Acount, Leave limits, filters and other
				personal informations
			</CardContent>
		</Card>
	);
}
