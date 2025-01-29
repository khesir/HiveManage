import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import {Circle, MoreVertical, Ticket} from 'lucide-react';
import useTicketStore from '../../../../_components/hooks/use-ticket-store';
import {dateParser} from '@/lib/util/utils';
import {EmployeeAvatarCircles} from '@/components/ui/avatarcircles';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TaskContent() {
	const {data} = useTicketStore();

	if (!data) {
		return <Card>No data</Card>;
	}
	return (
		<Card>
			<CardHeader className="flex flex-col items-start bg-muted/50">
				<CardTitle className="w-full flex items-center text-lg justify-between">
					<div className="flex gap-3 items-center">
						<p> {data.title}</p>
						<Button size="sm" variant="outline" className="h-8 gap-1">
							<Circle className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
								{data.remarkticket_status}
							</span>
						</Button>
					</div>
					<div className="flex gap-5">
						<EmployeeAvatarCircles
							employees={data.remark_assign.map((emp) => emp.employee)}
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="outline" className="h-8 w-8">
									<MoreVertical className="h-3.5 w-3.5" />
									<span className="sr-only">More</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Edit</DropdownMenuItem>
								<DropdownMenuItem>Assign Employee</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Delete</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardTitle>
				<CardDescription>{data.description}</CardDescription>
				<div className="flex items-center gap-1">
					<Button size="sm" variant="outline" className="h-8 gap-1">
						<Ticket className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							{data.remark_type.name}
						</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm h-[calc(80vh-180px)] ">
				{data.content ? data.content.markdown : 'Create content'}
			</CardContent>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					<span className="pr-2">Deadline:</span>
					<time dateTime="2023-11-23">{dateParser(data.deadline ?? '')}</time>
				</div>
			</CardFooter>
		</Card>
	);
}
