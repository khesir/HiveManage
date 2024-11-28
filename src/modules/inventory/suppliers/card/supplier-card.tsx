import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import {Users2} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Supplier} from '../../_components/validation/supplier';

export function SupplierCard() {
	const navigate = useNavigate();
	const [supplier, setSupplier] = useState<Supplier[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<Supplier>>(
				'GET',
				`/api/v1/ims/supplier?no_pagination=true`,
			);
			setSupplier(res.data as Supplier[]);
		};

		fetchData();
	}, []);
	return (
		<Card
			x-chunk="dashboard-05-chunk-1"
			className="flex-1 relative overflow-hidden flex flex-col justify-center"
		>
			<CardHeader className="pb-2">
				<CardDescription>Suppliers</CardDescription>
			</CardHeader>
			<CardContent>
				<CardTitle className="text-4xl">{supplier.length}</CardTitle>
				{/* <div className="text-xs text-muted-foreground">15 are listed</div> */}
			</CardContent>
			<CardFooter className="space-x-3">
				<Button onClick={() => navigate('suppliers')}>
					<Users2 className="mr-2 h-4 w-4" />
					View Suppliers
				</Button>
			</CardFooter>
			<Users2 className="absolute w-[250px] h-[250px] -bottom-5 -right-20 text-slate-700" />
		</Card>
	);
}
