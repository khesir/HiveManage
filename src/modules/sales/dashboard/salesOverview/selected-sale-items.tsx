import {PaginationResponse, request} from '@/api/axios';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
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
import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {TooltipTrigger} from '@radix-ui/react-tooltip';
import {Bell, Trash2, Users} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
/* eslint-disable @typescript-eslint/no-explicit-any */

export function SelectedSaleItems() {
	const navigate = useNavigate();
	const {user} = useEmployeeRoleDetailsStore();
	const handleNavigate = () => {
		navigate('/sales/create-service');
	};
	const {salesHookData, setSaleHookData} = useSalesHook();
	const createServiceAction = async () => {
		try {
			// Reset the whole cache data
			setSaleHookData('', [], 'reset');
			const res = await request<PaginationResponse<ServiceWithDetails>>(
				'GET',
				'/api/v1/sms/service?sort=desc&limit=1',
			).then((data) =>
				data.data.length >= 1
					? data.data[0]
					: ({service_id: 0} as unknown as ServiceWithDetails),
			);
			const data = {
				service_title: `Service #${res.service_id + 1}`,
				service_description: `Is handled by ${user?.employee.firstname} ${user?.employee.middlename} ${user?.employee.lastname}`,
				employee_id: user?.employee.employee_id,
				status: 'Active',
				has_sales_item: false,
				has_borrow: false,
				has_job_order: false,
			};
			setSaleHookData('service', [data]);
			toast(`Service Created ${Number(res.service_id) + 1}`);
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				console.log(error.message);
			} else {
				console.log('An unknown error occurred');
			}
		}
	};
	const handleDelete = (data: any) => {
		setSaleHookData('sales_item', [data], 'remove');
	};
	return (
		<>
			<div className="flex items-center justify-between gap-3">
				<Button className="flex flex-auto" onClick={createServiceAction}>
					Create Service
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
							</AccordionTrigger>
							<AccordionContent>
								<ul className="grid gap-3 grid-cols-3">
									<span className="text-muted-foreground col-span-2">Fees</span>
									<span>
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
									<span>0 %</span>
									<span className="text-muted-foreground col-span-2 flex justify-end mr-5">
										Total
									</span>
									<span>
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
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Card>
				<div className="relative flex flex-col gap-3 z-10 mt-20 mx-3">
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
												<Badge>{item.data.related_data.joborder.status}</Badge>
											</div>
										</CardDescription>
									</CardHeader>
								)}
								<Button
									className="absolute bottom-0 right-0 hover:bg-red-600"
									size={'icon'}
									variant={'ghost'}
									onClick={() => handleDelete(item)}
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
			<Button className="w-full" onClick={handleNavigate}>
				Confirm
			</Button>
		</>
	);
}
