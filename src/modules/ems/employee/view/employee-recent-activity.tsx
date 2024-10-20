import {PaginationResponse, request} from '@/api/axios';
import {useEmployeeStore} from '@/components/hooks/use-employee-story';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import {ActivityLogsJoin} from '@/lib/employee-custom-form-schema';
import {dateParser} from '@/lib/util/utils';
import {useEffect, useState} from 'react';

export function EmployeeRecentActivity() {
	const {selectedEmployee} = useEmployeeStore();
	const [res, setres] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [activityLogs, setActivityLogs] = useState<ActivityLogsJoin[]>([]);
	useEffect(() => {
		if (!selectedEmployee) {
			setres('No employee selected');
			return;
		}
		setLoading(true);
		const fetchActivity = async () => {
			try {
				const response = await request<PaginationResponse<ActivityLogsJoin>>(
					'GET',
					`/api/v1/ems/activityLogs?sort=desc&limit=5&employee_id=${selectedEmployee.employee_id}`,
				);
				console.log(response.data);
				setActivityLogs(response.data);
			} catch (error) {
				if (error instanceof Error) {
					setres(error.message);
				} else {
					setres('Unknown Error has occured');
				}
			} finally {
				setLoading(false);
			}
		};
		fetchActivity();
	}, [selectedEmployee]);

	if (res) {
		return <div>{res}</div>;
	}
	if (loading) {
		return <div>Fetching activity logs ...</div>;
	}
	return (
		<div className="flex flex-col gap-5">
			<Card x-chunk="dashboard-05-chunk-1">
				<CardHeader className="pb-2">
					<CardDescription>Active Payroll</CardDescription>
					<CardTitle className="text-4xl">12</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-xs text-muted-foreground">
						Confirmed 12 employee / 20
					</div>
				</CardContent>
				<CardFooter>
					<Button>View Reports</Button>
				</CardFooter>
			</Card>

			<Card x-chunk="dashboard-01-chunk-5">
				<CardHeader>
					<CardTitle>Recent Activities</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					{activityLogs.map((data) => (
						<div className="flex items-center gap-4" key={data.activity_id}>
							<Avatar className="hidden h-9 w-9 sm:flex">
								<AvatarImage src="/avatars/01.png" alt="Avatar" />
								<AvatarFallback>
									{data.employee.firstname.charAt(0)}
									{data.employee.lastname.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<p className="text-md font-medium leading-none">
									{data.action}
								</p>
								{/* <p className="text-sm text-muted-foreground">
									olivia.martin@email.com
								</p> */}
							</div>
							<div className="ml-auto text-sm text-muted-foreground">
								{dateParser(data.created_at ?? '')}
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
