import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ChartContainer} from '@/components/ui/chart';
import {
	RadialBarChart,
	PolarGrid,
	RadialBar,
	PolarRadiusAxis,
	Label,
} from 'recharts';
import {Product} from '../../../../../components/validation/inventory/product';

interface ProductPriceCardProps {
	product: Product;
}
export function ProductStockCard({product}: ProductPriceCardProps) {
	const chartData = [
		{
			name: product.name,
			percentage: product.total_stock ?? 0,
			fill: 'hsl(var(--chart-1))',
		},
	];
	return (
		<Card className="flex flex-row justify-around lg:justify-between max-h-[200px]">
			<div className="flex flex-col justify-between  p-4">
				<CardHeader className="flex-1  p-0 m-0">
					<CardDescription>Overall Stocks</CardDescription>
					<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
						{product.total_stock}
						<span className="text-sm font-normal tracking-normal text-muted-foreground">
							units
						</span>
					</CardTitle>

					<CardDescription>Pending stocks</CardDescription>
					<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
						{product.item_record?.reduce(
							(acc, record) => acc + (record.ordered_qty || 0),
							0,
						)}
						<span className="text-sm font-normal tracking-normal text-muted-foreground">
							units
						</span>
					</CardTitle>
				</CardHeader>
			</div>

			<CardContent className="pb-0">
				<ChartContainer
					config={{
						percentage: {
							label: 'Stock Level',
							color: 'hsl(var(--chart-1))',
						},
					}}
					className="h-full aspect-square"
				>
					<RadialBarChart
						data={chartData}
						startAngle={0}
						endAngle={Math.round(
							((product.total_stock ?? 0) / product.stock_limit) * 360,
						)}
						innerRadius={80}
						outerRadius={150}
					>
						<PolarGrid
							gridType="circle"
							radialLines={false}
							stroke="none"
							className="first:fill-muted last:fill-background"
							polarRadius={[86, 74]}
						/>
						<RadialBar dataKey="percentage" background cornerRadius={10} />
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({viewBox}) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-2xl font-bold"
												>
													{chartData[0].percentage.toLocaleString()}/
													{product.stock_limit}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Stocks
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
