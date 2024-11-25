import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {Product} from '@/modules/inventory/_components/validation/product';

interface Props {
	data: Product;
}
export function InformationCard({data}: Props) {
	return (
		<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid h-full">
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Product ID</span>
					<span>{data.product_id}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Name</span>
					<span>{data.name}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Description</span>
					<span className="w-[300px] text-wrap text-end">
						{data.description}
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Category</span>
					<div className="flex gap-1 flex-wrap">
						{data.product_categories?.map((category) => (
							<Badge key={category.category_id}>
								{category?.category?.name ?? 'No Category Set'}
							</Badge>
						))}
					</div>
				</li>

				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Stock</span>
					<span>{`${data.total_stock ?? 0} / ${data.stock_limit}`}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Total Records</span>
					<span>{data.item_record?.length}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Last Update</span>
					<span>{dateParser(data.last_updated ?? '', true)}</span>
				</li>
			</ul>
		</Card>
	);
}
