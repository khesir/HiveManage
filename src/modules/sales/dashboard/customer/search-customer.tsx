import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {Customer} from '@/components/validation/customer';
import {useEffect, useState} from 'react';

interface Props {
	processCreate: (data: Customer) => void;
	showTitle?: boolean;
}
export function SearchCustomer({processCreate, showTitle = true}: Props) {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Function to handle customer search
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch all customers from the backend
				const response = await request<PaginationResponse<Customer>>(
					'GET',
					`/api/v1/cms/customer?no_pagination=true`,
				);
				setCustomers(response.data);
			} catch (error) {
				console.error('Error fetching customer:', error);
				setCustomers([]);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="flex flex-col gap-2">
			{showTitle && <h1 className="font-semibold">Search Customer</h1>}
			{/* ShadCN Command Component for displaying search results */}
			<Command>
				<CommandInput placeholder="Search for a customer..." />
				<CommandList className="max-h-[350px]">
					{customers.length > 0 ? (
						<CommandGroup heading="Customers">
							{customers.map((customer) => (
								<CommandItem
									key={customer.customer_id}
									onSelect={() => {
										setSelectedCustomer(customer);
										setIsModalOpen(true);
									}}
								>
									<div className="flex items-center gap-3">
										<div className="flex-1">
											<p className="font-semibold">{`${customer.firstname} ${customer.middlename} ${customer.lastname}`}</p>
											<p className="text-sm text-gray-500">{customer.email}</p>
										</div>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					) : (
						<p className="p-3 text-sm text-gray-500">No customers found.</p>
					)}
				</CommandList>
			</Command>
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle> Selected employee</DialogTitle>
							<DialogDescription>
								<Card className="p-4">
									<p className="font-semibold">{`${selectedCustomer?.firstname} ${selectedCustomer?.middlename} ${selectedCustomer?.lastname}`}</p>
									<p className="text-sm text-gray-500">
										{selectedCustomer?.email}
									</p>
								</Card>
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
							<Button
								onClick={() => {
									setIsModalOpen(false);
									processCreate(selectedCustomer!);
								}}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
