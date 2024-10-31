import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';

import useItemsWithDetailsStore from './hooks/use-items';

export function ItemProfile() {
	const {data} = useItemsWithDetailsStore();
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
						{`#${data.item_id} ${data.product.name}`}
					</CardTitle>
					{data && (
						<CardDescription>
							<span>Item price:</span> {data.product.price}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Product Information</div>
					<ul className="grid gap-3">
						<li className="flex flex-col gap-3">
							<span className="text-muted-foreground">Description</span>
							<span className="pl-3">{data.product.description}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Category</span>
							<span>{data.product.category.name}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Suppplier</span>
							<span>{data.product.supplier.name}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{data.product.supplier.contact_number}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
			</CardContent>
		</Card>
	);
}
