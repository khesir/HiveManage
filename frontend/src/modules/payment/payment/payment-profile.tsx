import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import usePaymentFormStore from '../_component/use-payments-hook';

export function PaymentProfile() {
	const {data} = usePaymentFormStore();
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
						{`#${data.payment_id}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Joined date: {dateParser(data.created_at ?? '')}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Method</span>
							<span>{data.payment_method}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Type</span>
							<span>{data.payment_type}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Discount Amount</span>
							<span>{data.discount_amount}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Ref #</span>
							<span>
								{data.reference_number
									? data.reference_number
									: 'No # provided'}
							</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
