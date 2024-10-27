import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Copy, PackageOpenIcon} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function SelectedSaleReviewItems() {
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate(-1);
	};
	const {salesHookData} = useSalesHook();
	return (
		<Card>
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						Service #123
						<Button
							size="icon"
							variant="outline"
							className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<Copy className="h-3 w-3" />
							<span className="sr-only">Copy Order ID</span>
						</Button>
					</CardTitle>
					<CardDescription>Date: November 23, 2023</CardDescription>
				</div>
				<div className="ml-auto flex items-center gap-1">
					<Button
						size="sm"
						variant="default"
						className="h-8 gap-1"
						onClick={handleNavigate}
					>
						<PackageOpenIcon className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Add more
						</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="m-0 p-0 border-y-2">
				<ScrollArea className="relative h-[calc(90vh-220px)]">
					<div className="relative flex flex-col gap-3 z-10 m-3">
						{salesHookData['sales_item'] &&
						salesHookData['sales_item'].length > 0 ? (
							salesHookData['sales_item'].map((item, index) => (
								<Card
									className="relative w-full h-[150px] flex items-center justify-start overflow-hidden"
									key={index}
								>
									{/* Handles Borrow, Reserve and Sales */}
									{item.data.type !== 'Joborder' ? (
										<CardHeader className="flex-grow">
											<CardTitle className="hover:underline">
												<span className="text-xs">
													{item.data.type !== 'Sales'
														? `( ${item.data.type} )`
														: ''}
												</span>{' '}
												<span className="font-semibold text-sm">
													{' '}
													{item.item.product.name} -{' '}
													{item.item.product.supplier.name}
												</span>
												{/* Adjust this to display the actual item name if available */}
											</CardTitle>
											<CardDescription className="font-semibold text-sm">
												<div className="flex gap-2 flex-wrap">
													<Badge>{item.item.product.category.name}</Badge>
													<Badge>{item.item.tag}</Badge>
												</div>
												<div className="flex gap-1">
													Price: {item.item.product.price}
												</div>
												<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
													Qty: {item.data.quantity}
												</p>
											</CardDescription>
										</CardHeader>
									) : (
										// Handles Job order card
										<CardHeader className="flex-grow">
											<CardTitle className="hover:underline">
												<span className="font-semibold text-sm">
													{item.data.type} - ID:{' '}
													{' ' + item.data.related_data.joborder.uuid}
												</span>
												{/* Adjust this to display the actual item name if available */}
											</CardTitle>
											<CardDescription className="font-semibold text-sm">
												<div className="flex gap-2 flex-wrap">
													<Badge>
														{item.data.related_data.joborder.status}
													</Badge>
												</div>
											</CardDescription>
										</CardHeader>
									)}
								</Card>
							))
						) : (
							<p className="flex justify-center font-semibold text-sm">
								Select an Item or a service
							</p> // Optional: Display a message if there are no items
						)}
					</div>
					{/* <Card className="absolute bottom-2 left-4 z-30 w-[90%] px-3 flex justify-center hover:bg-slate-300 cursor-pointer">
					<p className="text-md font-semibold">View more </p>
				</Card> */}
				</ScrollArea>
			</CardContent>
			<CardFooter className=" bg-muted/50 flex flex-col items-start w-full">
				<p className="font-semibold text-md">
					Item Listed(
					{salesHookData['sales_item']?.length
						? salesHookData['sales_item'].length
						: '0'}
					)- ₱
					{salesHookData['sales_item']?.length
						? ' ' +
							Math.round(
								salesHookData['sales_item'].reduce(
									(total, item) => total + item.data.total_price,
									0,
								),
							)
						: ' 0'}
				</p>

				<ul className="grid gap-3 grid-cols-3 w-full">
					<span className="text-muted-foreground col-span-2">Fees</span>
					<span className="font-semibold">
						{salesHookData['sales_item']
							? '₱ ' +
								Math.round(
									salesHookData['sales_item']?.reduce(
										(total, item) => total + item.data.total_price,
										0,
									),
								)
							: ' 0'}
					</span>
					<span className="text-muted-foreground col-span-2">VAT</span>
					<span className="font-semibold">0</span>
					<span className="text-muted-foreground col-span-2 flex justify-end mr-5">
						Total
					</span>
					<span className="font-semibold">
						{salesHookData['sales_item']
							? '₱ ' +
								Math.round(
									salesHookData['sales_item']?.reduce(
										(total, item) => total + item.data.total_price,
										0,
									),
								)
							: ' 0'}
					</span>
				</ul>
			</CardFooter>
		</Card>
	);
}
