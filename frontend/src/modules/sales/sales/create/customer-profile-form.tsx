import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {ArrowBigLeft} from 'lucide-react';
import {Customer} from '@/components/validation/customer';

interface Props {
	data: Customer;
	onClick: () => void;
	children?: React.ReactNode;
}
export function SalesCustomerProfile({data, onClick, children}: Props) {
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{data.customer_id
							? `#${data.customer_id} ${data.lastname}, ${data.firstname}`
							: `New | ${data.lastname}, ${data.firstname}`}
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
							<span>not tested</span>
						</li>
					</ul>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-3">
				<Button
					size="sm"
					variant="outline"
					className="h-10 w-full gap-1"
					type="button"
					onClick={() => onClick()}
				>
					<ArrowBigLeft className="h-3.5 w-3.5" />
					<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
						Change
					</span>
				</Button>
				{children && children}
			</CardFooter>
		</Card>
	);
}
