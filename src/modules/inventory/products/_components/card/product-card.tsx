import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {File} from 'lucide-react';
import {Product} from '../../../_components/validation/product';
import {ProductCategory} from '../../../_components/validation/category';

interface ProfileProps {
	data: Product | undefined;
}
export function ProductCard({data}: ProfileProps) {
	const navigate = useNavigate();
	return (
		<div className="overflow-hidden">
			<CardHeader className="relative flex flex-row items-center bg-muted/50">
				<div
					className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
					style={{
						backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${
							data?.img_url ? data?.img_url : '/img/placeholder.jpg'
						})`,
					}}
				></div>
				<div className="relative z-10 flex gap-4">
					<img
						src={
							typeof data?.img_url === 'string'
								? data.img_url
								: '/img/placeholder.jpg'
						}
						alt={`Product ID ${data?.product_id} - ${data?.name}`}
						className="rounded-lg w-20 h-20 object-cover"
					/>
					<div className="grid gap-0.5 text-white">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{`#${data?.product_id} ${data?.name}`}
						</CardTitle>
						<CardDescription className="text-gray-400">
							{data?.description}
						</CardDescription>
					</div>
				</div>
				<div className="relative z-10 ml-auto flex items-center gap-1">
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1"
						onClick={() => {
							navigate(`view/product/${data?.product_id}`);
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
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Name</span>
							<span>{data?.name}</span>
						</li>{' '}
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Categories</span>
							{data?.product_categories?.length ? (
								<>
									{data.product_categories
										.slice(0, 3)
										.map((category: ProductCategory) => (
											<Badge
												key={category.category_id}
												variant={'secondary'}
												className="rounded-sm px-1 font-normal"
											>
												{category.category?.name}
											</Badge>
										))}
									{data.product_categories.length > 3 && (
										<Badge
											variant={'secondary'}
											className="rounded-sm px-1 font-normal"
										>
											+{data.product_categories.length - 3}
										</Badge>
									)}
								</>
							) : null}
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Re-Order Level</span>
							<span>{data?.stock_limit}</span>
						</li>
						{/* <li className="flex flex-col gap-3">
							<span className="text-muted-foreground">Price</span>
							<span className="pl-3">{data?.total_stock}</span>
						</li> */}
					</ul>
				</div>
				{/* {showOrderDetails && (
					<>
						<Separator className="my-4" />

						<div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Active Orders</span>
									<span>10</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Total Orders</span>
									<span>1000</span>
								</li>
							</ul>
						</div>
					</>
				)} */}
			</CardContent>
		</div>
	);
}
