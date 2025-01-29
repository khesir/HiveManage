import {useNavigate} from 'react-router-dom';
import useProducts from '../hooks/use-products';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {dateParser} from '@/lib/util/utils';
import {File} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';

export function ProductProfile() {
	const navigate = useNavigate();
	const {data} = useProducts();

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
			<CardHeader className="relative flex flex-row items-start bg-muted/50">
				<div
					className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
					style={{
						backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${
							data?.img_url ? data?.img_url : '/img/placeholder.jpg'
						})`,
					}}
				></div>
				<div className="relative z-10 grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`# ${data.product_id} ${data.name}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Last Updated: {dateParser(data.last_updated ?? '')}
						</CardDescription>
					)}
				</div>
				<div className="relative ml-auto flex items-center gap-1">
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1"
						onClick={() => {
							const id = Number(data.product_id);
							if (location.pathname.startsWith('/sales')) {
								navigate(`/sales/inventory/products/view/${id}`);
							} else if (location.pathname.startsWith('/admin')) {
								navigate(`/admin/inventory/products/view/${id}`);
							} else if (location.pathname.startsWith('/tech')) {
								navigate(`/tech/inventory/products/view/${id}`);
							}
						}}
					>
						<File className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							View More
						</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex flex-col gap-3">
							<span className="items-start text-muted-foreground border-white">
								Description
							</span>
							<span className="border p-3 rounded-sm">{data.description}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Category</span>
							<span className="space-x-1">
								{(data.product_categories ?? []).slice(0, 1).map((category) => (
									<Badge key={category.category?.category_id}>
										{category.category?.name}
									</Badge>
								))}
								{(data.product_categories?.length ?? 0) > 1 && (
									<Badge>+{(data.product_categories?.length ?? 0) - 1}</Badge>
								)}
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Stock</span>
							<span>
								{data.total_stock} / {data.stock_limit}
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Suppliers</span>
							{/* <span>{data.barangay}</span> */}
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Reserved Qty</span>
							<span>{}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Ordered Qty</span>
							<span>Service data...</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Variants</span>
							<span>dropdown view</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
