import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
} from '@/components/ui/tooltip';
// import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {TooltipTrigger} from '@radix-ui/react-tooltip';
import {Bell, Trash2, Users} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function SelectedSaleItems() {
	const navigate = useNavigate();
	// const {user} = useEmployeeRoleDetailsStore();
	const {salesHookData, removeProduct} = useSalesHook();
	return (
		<>
			<div className="flex items-center justify-between gap-3">
				<Button
					className="flex flex-auto"
					onClick={() => navigate('/sales/create-service')}
				>
					Confirm
				</Button>
				<div className="space-x-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									variant={'outline'}
									size={'icon'}
									onClick={() => navigate('/sales/inquiry')}
								>
									<Bell />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Inquries</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									variant={'outline'}
									size={'icon'}
									onClick={() => navigate('/sales/customer')}
								>
									<Users />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Customer Database</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
			<ScrollArea className="relative h-[calc(90vh-220px)] rounded-md border">
				<Card className="absolute top-2 left-4 right-4 z-30 w-[90%] px-5 flex justify-between">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1">
							<AccordionTrigger
								value="item-1"
								className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
							>
								<p>
									Item Listed(
									{salesHookData.length ? salesHookData.length : '0'}
									)- ₱
									{salesHookData.length
										? ' ' +
											Math.round(
												salesHookData.reduce(
													(total, item) => total + (item.record.price || 0),
													0,
												),
											)
										: ' 0'}
								</p>
							</AccordionTrigger>
							<AccordionContent>
								<ul className="grid gap-3 grid-cols-3">
									<span className="text-muted-foreground col-span-2">Fees</span>
									<span>
										{salesHookData
											? '₱ ' +
												Math.round(
													salesHookData?.reduce(
														(total, item) => total + (item.record.price || 0),
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
														(total, item) => total + (item.record.price || 0),
														0,
													),
												)
											: ' 0'}
									</span>
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Card>
				<div className="relative flex flex-col gap-3 z-10 mt-20 mx-3">
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
										<div className="flex gap-1">Price: {item.record.price}</div>
										<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
											Qty: {item.quantity}
										</p>
									</CardDescription>
								</CardHeader>
								<Button
									className="absolute bottom-0 right-0 hover:bg-red-600"
									size={'icon'}
									variant={'ghost'}
									onClick={() => removeProduct(item.product_id)}
								>
									<Trash2 className="w-5 h-5  cursor-pointer" />
								</Button>
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
		</>
	);
}
