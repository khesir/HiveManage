import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ChartContainer} from '@/components/ui/chart';
import {ProductWithRelatedTables} from '@/modules/inventory/_components/validation/product';
import {Target} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {
	RadialBarChart,
	PolarGrid,
	RadialBar,
	PolarRadiusAxis,
	Label,
} from 'recharts';

interface ProductPriceCardProps {
	product: ProductWithRelatedTables;
}
export function ProductStockCard({product}: ProductPriceCardProps) {
	const navigate = useNavigate();
	const chartData = [
		{
			name: product.name,
			percentage: product.total_stocks,
			fill: 'hsl(var(--chart-1))',
		},
	];
	return (
		<Card className="flex flex-row flex-1  h-[250px]">
			<div className="flex flex-col justify-between  p-4">
				<CardHeader className="flex-1  p-0 m-0">
					<CardDescription>Re-order Level</CardDescription>
					<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
						{product.re_order_level}
						<span className="text-sm font-normal tracking-normal text-muted-foreground">
							units
						</span>
					</CardTitle>
				</CardHeader>
				<div className="flex flex-wrap gap-2">
					<Button onClick={() => navigate('create')} className="bg-green-400">
						<Target className="mr-2 h-4 w-4" />
						Stock in
					</Button>
					<Button onClick={() => navigate('create')} className="bg-green-400">
						<Target className="mr-2 h-4 w-4" />
						Stock out
					</Button>
					<Button onClick={() => navigate('create')} className="bg-green-400">
						<Target className="mr-2 h-4 w-4" />
						Re-order item
					</Button>
				</div>
			</div>

			<CardContent className="flex-1 pb-0">
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
							(product.total_stocks / product.inventory_limit) * 360,
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
													{product.inventory_limit}
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
