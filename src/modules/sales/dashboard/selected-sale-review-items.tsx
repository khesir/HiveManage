import {useSalesHook} from '@/components/hooks/use-sales-hook';
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
import {PackageOpenIcon} from 'lucide-react';
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
						Sales #123
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
				<ScrollArea className="relative h-[calc(75vh-220px)]">
					<div className="relative flex flex-col gap-3 z-10 m-3">
						{salesHookData && salesHookData.length > 0 ? (
							salesHookData.map((item, index) => (
								<Card
									className="relative w-full h-[150px] flex items-center justify-start overflow-hidden"
									key={index}
								>
									<CardHeader className="flex-grow">
										<CardTitle className="hover:underline">
											<span className="font-semibold text-sm">{`#${item.product_id}-${item.record.product?.name}`}</span>

											{/* Adjust this to display the actual item name if available */}
										</CardTitle>
										<CardDescription className="font-semibold text-sm">
											<div className="flex gap-1">
												Price: {item.record.price}
											</div>
											<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
												Qty: {item.quantity}
											</p>
										</CardDescription>
									</CardHeader>
								</Card>
							))
						) : (
							<p className="flex justify-center font-semibold text-sm">
								Select an Item
							</p> // Optional: Display a message if there are no items
						)}
					</div>
					{/* <Card className="absolute bottom-2 left-4 z-30 w-[90%] px-3 flex justify-center hover:bg-slate-300 cursor-pointer">
					<p className="text-md font-semibold">View more </p>
				</Card> */}
				</ScrollArea>
			</CardContent>
			<CardFooter className=" bg-muted/50 flex flex-col items-start w-full">
				<p>
					Item Listed(
					{salesHookData.length ? salesHookData.length : '0'}
					)- ₱
					{salesHookData.length
						? ' ' +
							Math.round(
								salesHookData.reduce(
									(total, item) =>
										total + (item.record.price || 0) * (item.quantity || 0),
									0,
								),
							)
						: ' 0'}
				</p>

				<ul className="grid gap-3 grid-cols-3">
					<span className="text-muted-foreground col-span-2">Fees</span>
					<span>
						{salesHookData
							? '₱ ' +
								Math.round(
									salesHookData?.reduce(
										(total, item) =>
											total + (item.record.price || 0) * (item.quantity || 0),
										0,
									),
								)
							: ' 0'}
					</span>

					<span className="text-muted-foreground col-span-2">VAT</span>
					<span>0 %</span>
					<span className="text-muted-foreground col-span-2 flex justify-end mr-5">
						Total
					</span>
					<span>
						{salesHookData
							? '₱ ' +
								Math.round(
									salesHookData?.reduce(
										(total, item) =>
											total + (item.record.price || 0) * item.quantity,
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
