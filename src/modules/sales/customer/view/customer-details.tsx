import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useSearchParams} from 'react-router-dom';
import ServiceList from '../../sales/salesList/service_list';

export function ViewCustomerDetails() {
	const [searchParams] = useSearchParams();

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
				</TabsList>
				<TabsContent value="Active">
					<ServiceList searchParams={searchParams} isDetails={true} />
				</TabsContent>
				<TabsContent value="History">
					<ServiceList searchParams={searchParams} isDetails={true} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
