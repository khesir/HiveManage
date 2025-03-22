import {Card, CardContent, CardFooter} from '@/components/ui/card';

import {useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {ApiRequest, request} from '@/api/axios';
import {Product} from '@/components/validation/inventory/product';
import {InformationCard} from './information-card';
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {Button} from '@/components/ui/button';
import {ViewRecordTabs} from '../item-record-tabs';
import useProducts from '@/modules/inventory/_components/hooks/use-products';

export function ProductInformationTab() {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const {data, setProduct} = useProducts();
	useEffect(() => {
		const fetchData = async () => {
			if (data === null) {
				const newProductData = await request<ApiRequest<Product>>(
					'GET',
					`/api/v1/ims/product/${id}`,
				);
				if (!Array.isArray(newProductData.data)) {
					setProduct(newProductData.data);
				} else {
					setProduct(newProductData.data[0]);
				}
			}
		};
		fetchData();
	}, []);
	if (!data || !id) {
		return <Card>No products found</Card>;
	}

	return (
		<div className="flex flex-col sm:gap-4 max-w-full">
			<div className="w-full">
				{/* Product List */}
				<div className="flex gap-5 h-[300px] w-full">
					{/* First section: 30% */}
					<div className="relative h-full overflow-hidden rounded-md flex-[1_1_30%] min-w-[250px]">
						<img
							src={
								typeof data.img_url === 'string'
									? data.img_url
									: `/img/placeholder.jpg`
							}
							alt="Selected profile"
							className="object-cover h-full w-full"
						/>
					</div>

					{/* Middle section: 40% */}
					<div className="flex-[1_1_40%] min-w-[300px]">
						<InformationCard data={data} />
					</div>

					{/* Third section: 30% */}
					<div className="flex-[1_1_30%] min-w-[250px]">
						<Card className="flex flex-col lg:max-w-md h-full">
							{/* <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
								<div>
									<CardDescription>Resting HR</CardDescription>
									<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
										62
										<span className="text-sm font-normal tracking-normal text-muted-foreground">
											bpm
										</span>
									</CardTitle>
								</div>
								<div>
									<CardDescription>Variability</CardDescription>
									<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
										35
										<span className="text-sm font-normal tracking-normal text-muted-foreground">
											ms
										</span>
									</CardTitle>
								</div>
							</CardHeader> */}
							<CardContent className="flex flex-1 items-center">
								<ChartContainer
									config={{
										resting: {
											label: 'Sold',
											color: 'hsl(var(--chart-1))',
										},
									}}
									className="w-full"
								>
									<LineChart
										accessibilityLayer
										margin={{
											left: 14,
											right: 14,
											top: 10,
										}}
										data={[
											{
												date: '2024-01-01',
												resting: 62,
											},
											{
												date: '2024-01-02',
												resting: 72,
											},
											{
												date: '2024-01-03',
												resting: 35,
											},
											{
												date: '2024-01-04',
												resting: 62,
											},
											{
												date: '2024-01-05',
												resting: 52,
											},
											{
												date: '2024-01-06',
												resting: 62,
											},
											{
												date: '2024-01-07',
												resting: 70,
											},
										]}
									>
										<CartesianGrid
											strokeDasharray="4 4"
											vertical={false}
											stroke="hsl(var(--muted-foreground))"
											strokeOpacity={0.5}
										/>
										<YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
										<XAxis
											dataKey="date"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											tickFormatter={(value) => {
												return new Date(value).toLocaleDateString('en-US', {
													weekday: 'short',
												});
											}}
										/>
										<Line
											dataKey="resting"
											type="natural"
											fill="var(--color-resting)"
											stroke="var(--color-resting)"
											strokeWidth={2}
											dot={false}
											activeDot={{
												fill: 'var(--color-resting)',
												stroke: 'var(--color-resting)',
												r: 4,
											}}
										/>
										<ChartTooltip
											content={
												<ChartTooltipContent
													indicator="line"
													labelFormatter={(value) => {
														return new Date(value).toLocaleDateString('en-US', {
															day: 'numeric',
															month: 'long',
															year: 'numeric',
														});
													}}
												/>
											}
											cursor={false}
										/>
									</LineChart>
								</ChartContainer>
							</CardContent>
							<CardFooter>
								<div className="flex justify-between w-full">
									<Button variant={'ghost'}>1D</Button>
									<Button variant={'ghost'}>7D</Button>
									<Button variant={'ghost'}>1M</Button>
									<Button variant={'ghost'}>3M</Button>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
			<ViewRecordTabs
				product_id={id}
				searchParams={searchParams}
				is_serialize={data.is_serialize ?? false}
			/>
		</div>
	);
}
