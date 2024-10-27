/* eslint-disable @typescript-eslint/no-explicit-any */
import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Customer} from '@/lib/cms-zod-schema';
import {useState} from 'react';
interface SearchCustomerProps {
	processCreate: (data: any[]) => void;
}
export function SearchCustomer({processCreate}: SearchCustomerProps) {
	const [query, setQuery] = useState<string>(''); // Search query (email or fullname)
	const [customer, setCustomer] = useState<Customer | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSearch = async () => {
		setLoading(true);
		try {
			console.log('Searching for Customer');

			// Make the request to your backend with query params
			const response = await request<PaginationResponse<Customer>>(
				'GET',
				`/api/v1/cms/customer?fullname=${query}`,
			);
			// Set the customer data if found
			if (response.data.length > 0) {
				setCustomer(response.data[0]);
			} else {
				setCustomer(undefined); // No customer found
			}
		} catch (error) {
			console.error('Error fetching customer:', error);
			setCustomer(undefined); // Handle case where no customer is found or an error occurs
		} finally {
			setLoading(false);
		}
	};

	const handleConfirm = () => {
		processCreate([customer]);
	};

	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-semibold">Search Customer</h1>
			<div className="flex gap-5">
				<Input
					type="string"
					placeholder="eg. name, email"
					value={query}
					onChange={(e) => setQuery(e.target.value)} // Update the query state
				/>
				<Button onClick={handleSearch} disabled={loading}>
					{loading ? 'Searching...' : 'Search'}
				</Button>
			</div>

			{customer ? (
				<>
					<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
						<ul className="grid gap-3">
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Fullname</span>
								<span>
									{customer.lastname}, {customer.firstname}{' '}
									{customer.middlename}
								</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Contact</span>
								<span>{customer.contact_phone}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Socials</span>
								<span>{customer.socials.flat}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Address Line</span>
								<span>{customer.addressline}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Barangay</span>
								<span>{customer.barangay}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Province</span>
								<span>{customer.province}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Email</span>
								<span>{customer.email}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Standing</span>
								<span>{customer.standing}</span>
							</li>
						</ul>
					</Card>
					<Button className="" onClick={() => handleConfirm}></Button>
				</>
			) : (
				<Card className="p-3 flex justify-center font-semibold">
					Search for a Customer
				</Card>
			)}
		</div>
	);
}
