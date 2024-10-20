import {Separator} from '@/components/ui/separator';
import {CreateCustomerForm} from '../customer/create-customer';
import {Heading} from '@/components/ui/heading'; // Assuming you have a custom Heading component
import {SelectedSaleReviewItems} from '../overview/selected-sale-review-items';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {SearchCustomer} from '../customer/search-customer';
import {Button} from '@/components/ui/button';

export function SalesCreateService() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Form */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Create Service`}
							description="Fill up the form and complete all the steps, After this we'll be moved to dedicated page for this service"
						/>
						<Separator />
					</div>
					<Tabs defaultValue="item-1">
						<div className="flex items-center justify-between">
							<TabsList>
								<TabsTrigger value="item-1">New Customer</TabsTrigger>
								<TabsTrigger value="item-2">Exisiting Customer</TabsTrigger>
							</TabsList>
							<Button> Skip </Button>
						</div>
						<TabsContent value="item-1" className="p-5">
							<CreateCustomerForm />
						</TabsContent>
						<TabsContent value="item-2" className="p-5">
							<SearchCustomer />
						</TabsContent>
					</Tabs>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Cart */}
					<SelectedSaleReviewItems />
				</div>
			</div>
		</div>
	);
}
