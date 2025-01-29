import {Card, CardContent} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {JobOrderWithDetails} from '@/modules/sales/_components/validation/joborder';

interface JoborderPriceBreakDownProps {
	data: JobOrderWithDetails;
}

export function JoborderPriceBreakDown({data}: JoborderPriceBreakDownProps) {
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<li className="flex items-center justify-between">
						<span className="text-muted-foreground">Total Cost</span>
						<span>{data.total_cost_price}</span>
					</li>
					<li className="flex items-center justify-between">
						<span className="text-muted-foreground">Service Fee</span>
						<span>{data.fee}</span>
					</li>
					<li className="flex items-center justify-between">
						<span className="text-muted-foreground">Other Fees</span>
						<span>Not yet settled</span>
					</li>
					<Separator />
					<li className="flex items-center justify-between">
						<span className="text-muted-foreground">Overall Cost</span>
						<span>{data.total_cost_price + data.fee}</span>
					</li>
				</div>
			</CardContent>
		</Card>
	);
}
