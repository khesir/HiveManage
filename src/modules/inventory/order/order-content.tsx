import {Card} from '@/components/ui/card';

import useOrderStore from '../_components/hooks/use-orders';

import {SupplierProfile} from '../suppliers/supplier-profile';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {OrderProfile} from './order-profile';
import {OrderItems} from './order-items';
import {useEffect} from 'react';
import useOrderItemStore from '../_components/hooks/use-order-items';
import {useNavigate} from 'react-router-dom';

export function OrderContent() {
	const {data} = useOrderStore();
	const navigate = useNavigate();
	const {resetOrderItem} = useOrderItemStore();
	useEffect(() => {
		resetOrderItem();
	}, []);
	return (
		<Card className="flex flex-row p-5 gap-5 h-[calc(100vh-210px)] border">
			{data ? (
				<>
					<div className="flex-1">
						<Tabs defaultValue="order">
							<div className="flex items-center">
								<TabsList className="">
									<TabsTrigger value="order">Items</TabsTrigger>
									<TabsTrigger value="supplier">Order Details</TabsTrigger>
								</TabsList>
							</div>

							<div>
								<TabsContent value="order">
									<OrderItems data={data ?? undefined} />
								</TabsContent>
								<TabsContent value="supplier" className="flex gap-5">
									<div className="flex-1">
										<OrderProfile data={data ?? undefined} />
									</div>
									<div className="flex-1">
										<SupplierProfile
											data={data?.supplier ?? undefined}
											showOrderDetails={false}
										/>
									</div>
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</>
			) : (
				<div className="flex-1 h-[calc(100vh-210px)]">
					<div
						className="flex items-center justify-center h-full hover:bg-secondary duration-200 cursor-pointer"
						onClick={() => navigate('create')}
					>
						<p className="text-lg font-semibold">Create Purchase Order</p>
					</div>
				</div>
			)}
		</Card>
	);
}
