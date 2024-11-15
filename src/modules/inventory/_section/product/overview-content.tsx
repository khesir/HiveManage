import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import StockLogsList from '../../stocklogs/stocklogs-list';
import {StockLogsProfile} from '../../stocklogs/stocklogs-profile';
import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
} from '@/components/ui/card';

export default function InventorySection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<div className="flex gap-5">
							<Card x-chunk="dashboard-05-chunk-1" className="flex-1">
								<CardHeader className="pb-2">
									<CardDescription>Total Products</CardDescription>
									<CardTitle className="text-4xl">100</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-xs text-muted-foreground">
										15 are listed
									</div>
								</CardContent>
							</Card>
							<Card x-chunk="dashboard-05-chunk-1" className="flex-1">
								<CardHeader className="pb-2">
									<CardDescription>Active Orders</CardDescription>
									<CardTitle className="text-4xl">12</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-xs text-muted-foreground">
										3 currently inprogress
									</div>
								</CardContent>
							</Card>
						</div>
						<Separator />
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* <StockLogsProfile /> */}
				</div>
			</div>
		</div>
	);
}
