import {useJoborderStore} from './hook/useJoborderStore';
import {Separator} from '@/components/ui/separator';
import {Card, CardHeader, CardContent} from '@/components/ui/card';

export function JoborderProfile() {
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
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Service ID</span>
							<span>{joborderData.service.service_id}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Type</span>
							<span>{joborderData.joborder_type.name}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>{joborderData.joborder_status}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Service Fee</span>
							<span>{joborderData.fee}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<div className="font-semibold">Other Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Employees</span>
							<span>List card Employee...</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Tasks </span>
							<span>1 / 12</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Total Value</span>
							<span>10000</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
