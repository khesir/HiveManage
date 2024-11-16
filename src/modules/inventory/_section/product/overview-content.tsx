import {Separator} from '@/components/ui/separator';
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
import {
	BookDown,
	BookUpIcon,
	CaravanIcon,
	PackageOpen,
	Plus,
} from 'lucide-react';

export default function InventorySection() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	return (
		<div className="flex flex-col sm:gap-4 p-4">
			<div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 max-h-[300px]">
				{/* Employee List */}
				<div className="h-full">
					<Card className="h-full" x-chunk="dashboard-05-chunk-1">
						<CardHeader className="pb-2">
							<CardTitle>Inventory Management system</CardTitle>
						</CardHeader>
						<CardContent className="pt-2">
							<CardDescription className="max-w-2xl text-balance leading-relaxed">
								Welcome to the Inventory System! Track and manage parts, tools,
								and supplies. Remember to adjust stock after each repair to keep
								counts accurate. Let&apos;s keep things running smoothly!
							</CardDescription>
						</CardContent>
						<CardFooter className="space-x-3">
							<Button onClick={() => navigate('create')}>
								<Plus className="mr-2 h-4 w-4" />
								Add Product
							</Button>
							<Button onClick={() => navigate('create')}>
								<BookUpIcon className="mr-2 h-4 w-4" />
								Stock In
							</Button>
							<Button onClick={() => navigate('create')}>
								<BookDown className="mr-2 h-4 w-4" />
								Stock Out
							</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="col-span-2 flex gap-5 h-full">
					<Card
						x-chunk="dashboard-05-chunk-1"
						className="flex-1 relative overflow-hidden flex flex-col justify-center"
					>
						<CardHeader className="pb-2">
							<CardDescription>Total Products</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">100</CardTitle>
							<div className="text-xs text-muted-foreground">15 are listed</div>
						</CardContent>
						<CardFooter className="space-x-3">
							<Button onClick={() => navigate('suppliers')}>
								<BookUpIcon className="mr-2 h-4 w-4" />
								View Suppliers
							</Button>
						</CardFooter>
						<PackageOpen className="absolute w-[250px] h-[250px] -bottom-5 -right-20 text-slate-700" />
					</Card>
					<Card
						x-chunk="dashboard-05-chunk-1"
						className="flex-1 relative overflow-hidden flex flex-col justify-center"
					>
						<CardHeader className="pb-2">
							<CardDescription>Active orders</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">10</CardTitle>
							<div className="text-xs text-muted-foreground">
								15 products low on stocks
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => navigate('orders')}>
								<BookUpIcon className="mr-2 h-4 w-4" />
								View Orders
							</Button>
						</CardFooter>
						<CaravanIcon className="absolute w-[250px] h-[250px] -bottom-5 -right-20 text-slate-700" />
					</Card>
				</div>
			</div>
			<Separator />
			<ProductWithDetailsList searchParams={searchParams} />
		</div>
	);
}
