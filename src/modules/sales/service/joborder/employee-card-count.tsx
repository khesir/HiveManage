import {AvatarCircles} from '@/components/ui/avatarcircles';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';

export function EmployeeCardCount() {
	return (
		<Card className="w-[40%]" x-chunk="dashboard-05-chunk-1">
			<CardHeader className="pb-2">
				<CardTitle>Employees</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-xs text-muted-foreground">
					+14 employee is in this JO
				</div>
			</CardContent>
			<CardFooter>
				<AvatarCircles avatarUrls={['#', '#', '#', '#']} numPeople={10} />
			</CardFooter>
		</Card>
	);
}
