import useCustomerFormStore from '@/components/hooks/use-customer-form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';

export function CustomerProfile() {
	const {data} = useCustomerFormStore();
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
						{`#${data.customer_id} ${data.lastname}, ${data.firstname}`}
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
							<span className="text-muted-foreground">Standing</span>
							<span>{data.standing}</span>
						</li>{' '}
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Email</span>
							<span>{data.email}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Address line</span>
							<span>{data.addressline}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Address line 2</span>
							<span>{data.barangay}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Socials</span>
							<span>{data.contact_phone}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">
								Processed Transactions
							</span>
							<span>10</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Has Service</span>
							<span>Service data...</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Reservation</span>
							<span>Reservation data...</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Borrowed Item</span>
							<span>Borrow data...</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Active Payments</span>
							<span>1</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
