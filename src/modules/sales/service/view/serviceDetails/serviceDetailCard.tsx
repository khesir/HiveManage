import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import useService from '@/modules/sales/_components/hooks/use-service';
import {ReplacementDetailsCard} from './replacement/replacementDetails';

export function ServiceDetails() {
	const {data} = useService();
	if (!data) {
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
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`Service ID #${data.uuid}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Joined date: {dateParser(data.created_at ?? '')}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			{data.service_type?.name === 'Repair' ? (
				<ReplacementDetailsCard />
			) : data.service_type?.name === 'Cleaning' ? (
				<CardContent>
					<p>Cleaning service details go here.</p>
				</CardContent>
			) : data.service_type?.name === 'Replacement' ? (
				<ReplacementDetailsCard />
			) : data.service_type?.name === 'Build' ? (
				<CardContent>
					<p>Build service details go here.</p>
				</CardContent>
			) : data.service_type?.name === 'Upgrade' ? (
				<CardContent>
					<p>Upgrade service details go here.</p>
				</CardContent>
			) : data.service_type?.name === 'Rent' ? (
				<CardContent>
					<p>Rent service details go here.</p>
				</CardContent>
			) : data.service_type?.name === 'Reserve' ? (
				<CardContent>
					<p>Reserve service details go here.</p>
				</CardContent>
			) : (
				<CardContent>
					<p>No selected Service</p>
				</CardContent>
			)}
		</Card>
	);
}
