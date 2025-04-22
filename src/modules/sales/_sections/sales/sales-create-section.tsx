/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading'; // Assuming you have a custom Heading component
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Payment} from '@/components/validation/payment';
import {useNavigate} from 'react-router-dom';
import {CreateSales} from '@/api/sales-api';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';
import {SalesCustomerProfile} from '../../sales/create/customer-profile-form';
import {CreatePaymentForm} from '../../sales/create/payment-form';
import {CreateCustomerForm} from '@/modules/customer/_components/create/create-customer';
import {SearchCustomer} from '../../dashboard/customer/search-customer';
import {SelectedSaleReviewItems} from '../../dashboard/selected-sale-review-items';
import {Customer} from '@/components/validation/customer';
import useCustomer from '@/components/hooks/use-sales-customer';

export function CreateSalesSection() {
	const [loading, setLoading] = useState<boolean>(false);
	const {salesHookData, resetProducts} = useSalesHook();
	const {customer, setCustomer, resetCustomer} = useCustomer();
	const navigate = useNavigate();
	const {user} = useEmployeeRoleDetailsStore();
	const processData = async (payment: Payment) => {
		setLoading(true);
		if (!user) {
			toast.error('User is null. Cannot proceed with creating sales.');
			setLoading(false);
			return;
		}
		const data = await CreateSales(
			salesHookData,
			customer,
			payment,
			user.employee.employee_id,
		);
		navigate(`/sales/system/sales/list/view/${data?.sales_id}`);
		resetCustomer();
		resetProducts();
		setLoading(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Create Sales`}
							description="Fill up the form and complete all the steps, After this we'll be moved to dedicated page for this service"
						/>
					</div>
					{customer ? (
						<div className="flex gap-5">
							<div className="flex-[50%]">
								{Object.keys(customer).length === 0 ? (
									<Card className="w-full h-[300px] p-5 flex flex-col gap-5">
										<div>
											<h3 className="text-lg font-semibold">
												No Customer Selected
											</h3>
											<p>Please select or create a customer to proceed.</p>
										</div>
										<Button variant="outline" onClick={() => resetCustomer()}>
											Reset
										</Button>
									</Card>
								) : (
									<SalesCustomerProfile
										data={customer}
										onClick={resetCustomer}
									/>
								)}
							</div>
							<div className="flex-[50%]">
								<CreatePaymentForm loading={loading} process={processData} />
							</div>
						</div>
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
