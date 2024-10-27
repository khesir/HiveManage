/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Badge} from 'lucide-react';

export function JoborderTaskList() {
	const selectedEmployee: any[] = [];
	return (
		<ScrollArea className="h-[calc(40vh-210px)] px-2">
			<div className="flex flex-col gap-3">
				{selectedEmployee.length !== 0 ? (
					selectedEmployee.map((employee, index) => (
						<Card
							className="relative w-full h-[100px] overflow-hidden"
							key={index}
						>
							<div className="flex justify-start">
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{`${employee.lastname}, ${employee.firstname} ${employee.middlename}`}
									</CardTitle>
									<CardDescription>
										<div className="space-x-1">
											<Badge>Role</Badge>
										</div>
									</CardDescription>
								</CardHeader>
							</div>
							<div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
								<Button>Remove</Button>
							</div>
						</Card>
					))
				) : (
					<div>No available Task</div>
				)}
			</div>
		</ScrollArea>
	);
}
