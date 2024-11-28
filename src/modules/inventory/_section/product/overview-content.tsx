import {Separator} from '@/components/ui/separator';
import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
} from '@/components/ui/card';
import ProductWithDetailsList from '../../products/product-list';
import {useSearchParams} from 'react-router-dom';
import {ProductOrder} from '../../products/_components/card/product-order';
import {TotalProductCard} from '../../products/_components/card/total-product-card';
import {SupplierCard} from '../../suppliers/card/supplier-card';

export default function InventorySection() {
	const [searchParams] = useSearchParams();
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<ProductWithDetailsList searchParams={searchParams} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					<div className="flex flex-col gap-4">
						<Card className="h-full" x-chunk="dashboard-05-chunk-1">
							<CardHeader className="pb-2">
								<CardTitle>Inventory Management system</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<CardDescription className="max-w-2xl text-balance leading-relaxed">
									Welcome to the Inventory System! Track and manage parts,
									tools, and supplies. Remember to adjust stock after each
									repair to keep counts accurate. Let&apos;s keep things running
									smoothly!
								</CardDescription>
							</CardContent>
						</Card>
					</div>
					<TotalProductCard />
					<SupplierCard />
					<ProductOrder />
				</div>
			</div>
		</div>
	);
}
