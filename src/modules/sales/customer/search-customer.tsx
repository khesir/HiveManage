import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Customer} from '@/lib/cms-zod-schema';
import {useState} from 'react';

export function SearchCustomer() {
	const [customer, setCustomer] = useState<Customer | undefined>(undefined);

	const handleSearch = async () => {
		console.log('Searching for Customer');
		// Do A request here
	};
	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-semibold">Search Customer</h1>
			<div className="flex gap-5">
				<Input type="string" placeholder="eg. name, email" />
				<Button onClick={handleSearch}>Search</Button>
			</div>
			{customer ? (
				<Card></Card>
			) : (
				<Card className="p-3 flex justify-center font-semibold">
					Search an Cusotmer
				</Card>
			)}
		</div>
	);
}
