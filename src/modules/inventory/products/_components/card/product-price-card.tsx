import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {ProductWithRelatedTables} from '@/components/validation/inventory/product';
import {CartesianGrid, YAxis, XAxis, Line, LineChart} from 'recharts';

interface ProductPriceCardProps {
	product: ProductWithRelatedTables;
}
export function ProductPriceCard({product}: ProductPriceCardProps) {
	return (
		<div className="flex-1 min-h-full w-full">
			<Card className="flex flex-col w-full" x-chunk="charts-01-chunk-1">
				<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
					<div>
						<CardDescription>Selling Price</CardDescription>
						<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
							{product.price_history?.[0]?.price
								? `₱ ${product.price_history[0].price}`
								: 'N/A'}
						</CardTitle>
					</div>
					<div>
						<CardDescription>Estimated Price</CardDescription>
						<CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
							₱ 300
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="flex flex-1 items-center w-full">
					<ChartContainer
						config={{
							resting: {
								label: 'price',
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
								top: 40,
							}}
							data={product.price_history?.map((emp) => ({
								date: emp.created_at,
								price: emp.price,
							}))}
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
								dataKey="price"
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
			</Card>
		</div>
	);
}
