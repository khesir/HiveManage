import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';
import useStockLogsWithDetailsFormStore from './hooks/use-stock-logs';
import {Button} from '@/components/ui/button';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination';
import {ChevronLeft, ChevronRight} from 'lucide-react';

export function StockLogsProfile() {
	const {data} = useStockLogsWithDetailsFormStore();
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
						{`#${data.item.item_id} ${data.item.product.name}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Created date: {dateParser(data.created_at ?? '')}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Movement Type</span>
							<span>{data.movement_type}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Action</span>
							<span>{data.action}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Quantity</span>
							<span>{data.quantity}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Item Price</span>
							<span>{data.item.product.price}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Total</span>
							<span>{data.item.product.price * data.quantity}</span>
						</li>
					</ul>
				</div>
			</CardContent>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					Click Next to view more details
				</div>
				<Pagination className="ml-auto mr-0 w-auto">
					<PaginationContent>
						<PaginationItem>
							<Button size="icon" variant="outline" className="h-6 w-6">
								<ChevronLeft className="h-3.5 w-3.5" />
								<span className="sr-only">Previous Order</span>
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button size="icon" variant="outline" className="h-6 w-6">
								<ChevronRight className="h-3.5 w-3.5" />
								<span className="sr-only">Next Order</span>
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</CardFooter>
		</Card>
	);
}
