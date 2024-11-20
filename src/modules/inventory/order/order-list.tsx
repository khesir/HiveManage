import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {OrderWithDetails} from '../_components/validation/order';
import {ScrollArea} from '@/components/ui/scroll-area';
import {PaginationResponse, request} from '@/api/axios';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {dateParser} from '@/lib/util/utils';
import useOrderStore from '../_components/hooks/use-orders';

export function OrderList() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [orders, setOrders] = useState<OrderWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const pageLimit = 10;

	const page = Number(searchParams.get('page')) || 1;
	const offset = (page - 1) * pageLimit;
	const sort = searchParams.get('sort') || null;
	const currentPage = offset / pageLimit + 1;

	// Interactivity
	const {setOrder} = useOrderStore();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await request<PaginationResponse<OrderWithDetails>>(
				'GET',
				`/api/v1/ims/order?limit=${pageLimit}&offeset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			console.log(res.data);
			setOrders(res.data);
			setOrder(res.data[0]);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit]);
	const handlePaginationChange = (newPage: number) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('page', String(newPage));
		newParams.set('limit', String(pageLimit));
		navigate({search: newParams.toString()});
	};
	if (orders.length === 0) {
		return (
			<Card className="relative w-full h-[170px] overflow-hidden">
				<CardTitle className="h-full font-semibold text-xl  hover:underline flex Products-center justify-center">
					No product Available
				</CardTitle>
			</Card>
		);
	}
	return (
		<>
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{orders.map((order) => (
						<Card
							key={order.order_id}
							onClick={() => setOrder(order)}
							className="cursor-pointer"
						>
							<CardHeader className="flex gap-2 flex-row p-2 m-0">
								<AvatarCircles
									avatar={[
										{
											link: order.supplier?.profile_link
												? order.supplier?.profile_link
												: '#',
											name: order.supplier?.name ?? 'Unknown Supplier',
										},
									]}
								/>
								<CardTitle className="text-sm">
									{order.supplier?.name}
								</CardTitle>
								<div className="ml-auto">
									<Badge>{order.status}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<Card className="p-4">
									<CardDescription className="grid gap-3">
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Ordered Items
											</span>
											<span>
												{order.order_item ? order.order_item.length : 0}
											</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">Order Value</span>
											<span>{order.ordered_value}</span>
										</li>
									</CardDescription>
								</Card>
							</CardContent>
							<CardFooter className="text-sm text-muted-foreground">
								Expected Arrival: {dateParser(order.expected_arrival ?? '')}
							</CardFooter>
						</Card>
					))}
				</div>
			</ScrollArea>
			<div className="flex flex-col Products-center justify-between gap-2 space-x-2 py-4 sm:flex-row">
				<div className="flex Products-center justify-center text-sm font-medium">
					Page {currentPage} of {pageCount}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						aria-label="Go to first page"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePaginationChange(1)}
						disabled={currentPage === 1}
					>
						<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to previous page"
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePaginationChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePaginationChange(currentPage + 1)}
						disabled={currentPage === pageCount}
					>
						<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to last page"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePaginationChange(pageCount)}
						disabled={currentPage === pageCount}
					>
						<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</>
	);
}
