import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Separator} from '@/components/ui/separator';
import useService from '../../_components/hooks/use-service';

export function ServiceInformation() {
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
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Handled By</span>
							<span>
								<AvatarCircles
									avatar={(data.assigned ?? []).map((leader) => ({
										link:
											leader.employee?.profile_link ??
											'/public/default-avatar.png',
										name: `${leader.employee?.firstname} ${leader.employee?.middlename} ${leader.employee?.lastname}`,
									}))}
								/>
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Total Cost</span>
							<span>{data.total_cost_price}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>{data.service_status}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Type</span>
							<span>{data.service_type?.name}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div className="grid gap-3">
					<div className="font-semibold">Customer Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Name</span>
							<span>{`${data.customer?.firstname} ${data.customer?.middlename} ${data.customer?.lastname}`}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Email</span>
							<span>{data.customer?.email}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{data.customer?.contact_phone}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Social</span>
							<span>In development</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
