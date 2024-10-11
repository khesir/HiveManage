import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardHeader} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Separator} from '@/components/ui/separator';
import {useNavigate} from 'react-router-dom';

export interface Task {
	module: string;
	status: string;
	taskList: string[];
	button: {
		link: string;
		variant:
			| 'default'
			| 'link'
			| 'destructive'
			| 'outline'
			| 'secondary'
			| 'ghost';
	};
}
interface TaskCardProps {
	task: Task;
}

export function TaskCard({task}: TaskCardProps) {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-3">
			<Card>
				<CardHeader>{task.module} Module</CardHeader>
				<Separator />
				<CardDescription className="p-2">
					<div className="flex justify-between mb-3">
						<span>Status</span> <span>{task.status}</span>
					</div>
					<div>Task:</div>
					<div className="flex flex-col">
						{task.taskList.map((taskName, index) => (
							<div key={index} className="flex items-center space-x-2">
								<Checkbox />
								<label>{taskName}</label>
							</div>
						))}
					</div>
				</CardDescription>
			</Card>
			<Button
				variant={task.button.variant}
				onClick={() => navigate(task.button.link)}
			>
				Go Work
			</Button>
		</div>
	);
}
