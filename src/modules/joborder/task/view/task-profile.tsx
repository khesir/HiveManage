import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {useJoborderStore} from '@/modules/sales/_components/hooks/use-joborder-store';
import {Plus, UserCircle} from 'lucide-react';

export function TaskListProfile() {
	const {joborderData} = useJoborderStore();
	if (!joborderData) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col items-start bg-muted/50 p-5">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{`Joborder #${joborderData?.joborder_id}`}
						</CardTitle>
						<CardDescription className="text-start">
							{joborderData?.uuid}
						</CardDescription>
					</div>
					<div className="flex items-center gap-1">
						<Button size="sm" variant="default" className="h-8 gap-1">
							<Plus className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
								Add Item
							</span>
						</Button>
						<Button size="sm" variant="default" className="h-8 gap-1">
							<UserCircle className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
								Assign Employee
							</span>
						</Button>
					</div>
				</CardHeader>
			</Card>
		</>
	);
}
