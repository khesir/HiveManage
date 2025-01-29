import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import ProductWithDetailsList from '../../products/product-list';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {BookUpIcon, Users2} from 'lucide-react';
import {Separator} from '@radix-ui/react-dropdown-menu';
import {ProductProfile} from '../../_components/product/product-profile';

export default function InventorySection() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}

				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
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
							<CardFooter className="space-x-2">
								<Button onClick={() => navigate('suppliers')}>
									<Users2 className="mr-2 h-4 w-4" />
									View Suppliers
								</Button>
								<Button onClick={() => navigate('orders')}>
									<BookUpIcon className="mr-2 h-4 w-4" />
									View Orders
								</Button>
							</CardFooter>
						</Card>
					</div>
					<ProductWithDetailsList searchParams={searchParams} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Service Profile */}
					<ProductProfile />
				</div>
			</div>
		</div>
	);
}
