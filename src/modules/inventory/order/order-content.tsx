import {Card} from '@/components/ui/card';

import useOrderStore from '../_components/hooks/use-orders';

import {SupplierProfile} from '../suppliers/supplier-profile';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {OrderProfile} from './order-profile';
import {OrderItems} from './order-items';
import useVerification from '../_components/hooks/use-verfication';
import {Button} from '@/components/ui/button';
import {useEffect} from 'react';
import useOrderItemStore from '../_components/hooks/use-order-items';
import {OrderTrackingView} from './order-tracking-view';
import {Trash2Icon} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export function OrderContent() {
	const {data} = useOrderStore();
	const {status, setStatus} = useVerification();
	const {orderItem, resetOrderItem} = useOrderItemStore();
	console.log(data);
	useEffect(() => {
		setStatus(false);
		resetOrderItem();
	}, []);
	return (
		<Card className="flex flex-row p-5 gap-5">
			{!status && !orderItem ? (
				<>
					<div className="flex-1">
						<Tabs defaultValue="order">
							<div className="flex items-center">
								<TabsList className="w-full flex">
									<TabsTrigger value="order" className="flex-1">
										Order
									</TabsTrigger>
									<TabsTrigger value="supplier" className="flex-1">
										Supplier
									</TabsTrigger>
								</TabsList>
							</div>
							<TabsContent value="order">
								<OrderProfile data={data ?? undefined} />
							</TabsContent>
							<TabsContent value="supplier">
								<SupplierProfile
									data={data?.supplier ?? undefined}
									showOrderDetails={false}
								/>
							</TabsContent>
						</Tabs>
					</div>
					<OrderItems data={data ?? undefined} />
				</>
			) : orderItem ? (
				<div className="h-[calc(100vh-210px)] w-full">
					<div className="flex justify-between">
						<div className="flex items-center gap-5">
							<Button
								size={'sm'}
								onClick={() => resetOrderItem()}
								className="bg-red-600 w-[100px]"
							>
								Back
							</Button>
							<p>Order Item Tracking</p>
						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Button variant={'outline'}>
										<Trash2Icon />
									</Button>
								</TooltipTrigger>
								<TooltipContent> Delete Order Item</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<OrderTrackingView data={orderItem} />
				</div>
			) : (
				<Button onClick={() => setStatus(false)} className="bg-red-600">
					Back
				</Button>
			)}
		</Card>
	);
}
