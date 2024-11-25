import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import {BookUpIcon, CaravanIcon} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function ProductOrder() {
	const navigate = useNavigate();
	return (
		<Card
			x-chunk="dashboard-05-chunk-1"
			className="flex-1 relative overflow-hidden flex flex-col justify-center"
		>
			<CardHeader className="pb-2">
				<CardDescription>Active orders</CardDescription>
			</CardHeader>
			<CardContent>
				<CardTitle className="text-4xl">10</CardTitle>
				<div className="text-xs text-muted-foreground">
					15 products low on stocks
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={() => navigate('orders')}>
					<BookUpIcon className="mr-2 h-4 w-4" />
					View Orders
				</Button>
			</CardFooter>
			<CaravanIcon className="absolute w-[250px] h-[250px] -bottom-5 -right-20 text-slate-700" />
		</Card>
	);
}
