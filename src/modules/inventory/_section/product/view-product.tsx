import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import {Separator} from '@/components/ui/separator';
import {Plus, Target} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';

import {ProductWithRelatedTables} from '../../_components/validation/product';
import {ApiRequest, request} from '@/api/axios';
import {ProductPriceCard} from '../../products/card/product-price-card';
import {ProductStockCard} from '../../products/card/product-stock-card';
import ProductWithDetailsList from '../../products/view/inventory-record-list';
import {Badge} from '@/components/ui/badge';
import {StockLogsMini} from '../../products/stocklogs/stocklogs-mini';

export default function ViewProductRecord() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const {id} = useParams();
	const [products, setProducts] = useState<
		ProductWithRelatedTables | undefined
	>(undefined);
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<ProductWithRelatedTables>>(
				'GET',
				`/api/v1/ims/product/${id}`,
			);
			if (!Array.isArray(res.data)) {
				setProducts(res.data);
			} else {
				setProducts(res.data[0]);
			}
		};
		fetchData();
	}, []);
	if (!products || !id) {
		return <Card>No products found</Card>;
	}

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Product List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<div className="h-full flex gap-5">
							{/* Title Card */}
							<Card className="flex-1 h-[250px]" x-chunk="dashboard-05-chunk-1">
								<CardHeader className="pb-2">
									<CardTitle>{products.name}</CardTitle>
								</CardHeader>
								<CardContent className="pt-2">
									<CardDescription className="max-w-2xl text-balance leading-relaxed space-y-2">
										<div className="flex gap-1 flex-wrap">
											{products.product_categories?.map((category) => (
												<Badge key={category.category_id}>
													{category.category.name}
												</Badge>
											))}
										</div>
										<p>{products.description}</p>
									</CardDescription>
								</CardContent>
								<CardFooter className="space-x-3">
									<Button onClick={() => navigate('create')}>
										<Plus className="mr-2 h-4 w-4" />
										Edit Product
									</Button>
									<Button
										onClick={() => navigate('create')}
										className="bg-green-400"
									>
										<Target className="mr-2 h-4 w-4" />
										On Listing
									</Button>
								</CardFooter>
							</Card>
							{/* Stocks Card */}
							<ProductStockCard product={products} />
						</div>
						<Separator />
					</div>
					<ProductWithDetailsList searchParams={searchParams} product_id={id} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					<div className="flex-0 ">
						<ProductPriceCard product={products} />
					</div>
					<Card x-chunk="dashboard-01-chunk-5" className="flex-1 h-[600px]">
						<CardHeader>
							<CardTitle>Stock Logs</CardTitle>
						</CardHeader>
						<StockLogsMini product_id={id} />
					</Card>
				</div>
			</div>
		</div>
	);
}
