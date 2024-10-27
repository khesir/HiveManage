import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useSearchParams} from 'react-router-dom';
import useCustomerFormStore from '@/modules/sales/customer/hooks/use-customer-form';
import ServiceList from '../../sales/service_list';

export function ViewCustomerDetails() {
	const [searchParams] = useSearchParams();
	const {data} = useCustomerFormStore(); // Fetch customer data from the store

	return (
		<div className="flex flex-col sm:gap-4">
			<Heading
				title={'Customer Details'}
				description={'Customer all necessary data breakdown'}
			/>
			<Separator />
			<Tabs defaultValue="Active">
				<TabsList>
					<TabsTrigger value="Active">Active Service</TabsTrigger>
					<TabsTrigger value="History">Service History</TabsTrigger>
					<TabsTrigger value="Payments">Payments</TabsTrigger>
				</TabsList>
				<TabsContent value="Active">
					<ServiceList
						searchParams={searchParams}
						isDetails={true}
						service_status="Active"
						customer_id={data?.customer_id}
					/>
				</TabsContent>
				<TabsContent value="History">
					<ServiceList
						searchParams={searchParams}
						isDetails={true}
						service_status="Inactive"
						customer_id={data?.customer_id}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
