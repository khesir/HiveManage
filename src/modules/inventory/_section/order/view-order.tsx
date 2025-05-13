import {useParams} from 'react-router-dom';
import {useEffect} from 'react';
import useOrderStore from '@/api/order-state';
import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import OrderInformationProfile from '../../order/view/information/information-profile';
import {ControlTabOrder} from '../../order/view/information/features/control-tab';
import useEventTrigger from '../../_components/hooks/use-event-trigger';

export default function ViewOrderSection() {
	const {id} = useParams();
	const {getOrderById} = useOrderStore();
	const {isTriggered} = useEventTrigger();
	useEffect(() => {
		getOrderById(Number(id));
	}, [id, isTriggered]);
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Ordered Products`}
							description="Once finalize, all records will be appended based on orders"
						/>
						<Separator />
					</div>
					<ControlTabOrder />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Service Profile */}
					<OrderInformationProfile />
				</div>
			</div>
		</div>
	);
}
