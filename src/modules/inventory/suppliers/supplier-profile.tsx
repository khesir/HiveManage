import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {File} from 'lucide-react';
import {Supplier} from '../../../components/validation/inventory/supplier';
import {ProductCategory} from '../../../components/validation/inventory/category';

interface ProfileProps {
	data: Supplier | undefined;
	showOrderDetails?: boolean;
}
export function SupplierProfile({data, showOrderDetails = true}: ProfileProps) {
	const navigate = useNavigate();
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="relative flex flex-row items-center bg-muted/50">
				<div
					className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
					style={{
						backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${
							data?.profile_link ? data?.profile_link : '/img/placeholder.jpg'
						})`,
					}}
				></div>
				<div className="relative z-10 flex gap-4">
					<img
						src={
							typeof data?.profile_link === 'string'
								? data?.profile_link
								: '/img/placeholder.jpg'
						}
						alt={`Supplier ID ${data?.supplier_id} - ${data?.name}`}
						className="rounded-lg w-20 h-20 object-cover"
					/>
					<div className="grid gap-0.5 text-white">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{`#${data?.supplier_id} ${data?.name}`}
						</CardTitle>
						<CardDescription className="text-gray-400">
							{data?.remarks}
						</CardDescription>
					</div>
				</div>
				<div className="relative z-10 ml-auto flex items-center gap-1">
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1"
						onClick={() => {
							navigate(`view/${data?.supplier_id}`);
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
							<span className="text-muted-foreground">Contact</span>
							<span>{data?.contact_number}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Categories</span>
							{data?.categories?.length ? (
								<>
									{data.categories
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
									{data.categories.length > 3 && (
										<Badge
											variant={'secondary'}
											className="rounded-sm px-1 font-normal"
										>
											+{data.categories.length - 3}
										</Badge>
									)}
								</>
							) : null}
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Relationship</span>
							<span>{data?.relationship}</span>
						</li>
						<li className="flex flex-col gap-3">
							<span className="text-muted-foreground">Remarks</span>
							<span className="pl-3">{data?.remarks}</span>
						</li>
					</ul>
				</div>
				{showOrderDetails && (
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
				)}
			</CardContent>
		</Card>
	);
}
