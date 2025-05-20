import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Sales} from '@/components/validation/sales';
import {useEffect, useState} from 'react';

export function SalesReport() {
	const [salesData, setSales] = useState<Sales[]>([]);
	const [range, setRange] = useState('1d');
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<PaginationResponse<Sales>>(
				'GET',
				`/api/v1/sms/sales?no_pagination=true&status=Completed&range=${range}`,
			);
			// PrepareData for
			setSales(res.data);
		};
		fetchData();
	}, [range]);
	return (
		<div className="flex flex-col gap-2">
			<div>Total Earnings</div>
			<div className="py-2 font-semibold text-xl">
				{salesData
					.reduce((total, item) => total + (item.payment?.amount ?? 0), 0)
					.toFixed(2)}
			</div>
			<div className="flex gap-3">
				<Button size={'sm'} variant={'ghost'} onClick={() => setRange('1d')}>
					1D
				</Button>
				<Button size={'sm'} variant={'ghost'} onClick={() => setRange('7d')}>
					7D
				</Button>
				<Button size={'sm'} variant={'ghost'} onClick={() => setRange('14d')}>
					2W
				</Button>
				<Button size={'sm'} variant={'ghost'} onClick={() => setRange('1m')}>
					1M
				</Button>
				<Button size={'sm'} variant={'ghost'} onClick={() => setRange('3m')}>
					3M
				</Button>
			</div>
		</div>
	);
}
