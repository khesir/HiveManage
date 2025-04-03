/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Separator} from '@/components/ui/separator';
import {CreateCustomerForm} from '../../customer/_components/create/create-customer';
import {Heading} from '@/components/ui/heading'; // Assuming you have a custom Heading component
import {SelectedSaleReviewItems} from '../dashboard/selected-sale-review-items';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {SearchCustomer} from '../dashboard/customer/search-customer';
import {Button} from '@/components/ui/button';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Customer} from '@/lib/cms-zod-schema';

export function CreateSalesSection() {
	const {salesHookcustomer, setSaleHookcustomer} = useSalesHook();
	const [customer, setCustomer] = useState<Customer | undefined>();

	return (
		<div className="flex flex-col gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Form */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Create Sales`}
							description="Fill up the form and complete all the steps, After this we'll be moved to dedicated page for this service"
						/>
					</div>
					{customer?.customer_id ? (
						<Card className="w-full p-5 flex flex-col gap-5">
							<div className="text-lg">
								{`#${customer.customer_id} ${customer.lastname}, ${customer.firstname}`}
							</div>
							<div className="grid gap-3">
								<div className="font-semibold">Information</div>
								<ul className="grid gap-3">
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Standing</span>
										<span>{customer.standing}</span>
									</li>{' '}
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Email</span>
										<span>{customer.email}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Address line</span>
										<span>{customer.addressline}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Address line 2
										</span>
										<span>{customer.barangay}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Socials</span>
										<span>not tested</span>
									</li>
								</ul>
							</div>
							<Button variant="outline" onClick={() => setCustomer(undefined)}>
								Change Customer
							</Button>
							<Button className="bg-green-400">Create Sale</Button>
						</Card>
					) : customer ? (
						<Card className="w-full h-[300px] p-5 flex flex-col gap-5">
							<div>
								<h3 className="text-lg font-semibold">No Customer Selected</h3>
								<p>Please select or create a customer to proceed.</p>
							</div>
							<Button variant="outline" onClick={() => setCustomer(undefined)}>
								Reset
							</Button>
							<Button className="bg-green-400">Create Sale</Button>
						</Card>
					) : (
						<>
							<Separator />
							<Tabs defaultValue="item-1">
								<div className="flex items-center justify-between">
									<TabsList>
										<TabsTrigger value="item-1">New Customer</TabsTrigger>
										<TabsTrigger value="item-2">Existing Customer</TabsTrigger>
									</TabsList>
									<Button onClick={() => setCustomer({} as Customer)}>
										Skip
									</Button>
								</div>
								<TabsContent value="item-1" className="p-5">
									<CreateCustomerForm processCreate={setCustomer} />
								</TabsContent>
								<TabsContent value="item-2" className="p-5">
									<SearchCustomer processCreate={setCustomer} />
								</TabsContent>
							</Tabs>
						</>
					)}
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
