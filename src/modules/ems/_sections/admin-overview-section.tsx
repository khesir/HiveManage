import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
	CardContent,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
} from '@/components/ui/table';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

import {File, ListFilter} from 'lucide-react';

export function AdminOverviewSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="flex flex-col col-span-2 gap-5">
					<Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
						<CardHeader className="pb-3">
							<CardTitle>EMS (Quick Actions)</CardTitle>
							<CardDescription className="max-w-lg text-balance leading-relaxed">
								I still dont know what to put here but anyways this is a
								description, everything here is a mockup
							</CardDescription>
						</CardHeader>
						<CardFooter className="space-x-3">
							<Button>Create Employee</Button>
							<Button>Create Payroll</Button>
						</CardFooter>
					</Card>
					<Tabs defaultValue="week">
						<div className="flex items-center">
							<TabsList>
								<TabsTrigger value="week">Week</TabsTrigger>
								<TabsTrigger value="month">Month</TabsTrigger>
								<TabsTrigger value="year">Year</TabsTrigger>
							</TabsList>
							<div className="ml-auto flex items-center gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="h-7 gap-1 text-sm"
										>
											<ListFilter className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only">Filter</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Filter by</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem checked>
											Fulfilled
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>
											Declined
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>
											Refunded
										</DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button
									size="sm"
									variant="outline"
									className="h-7 gap-1 text-sm"
								>
									<File className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only">Export</span>
								</Button>
							</div>
						</div>
						<TabsContent value="week">
							<Card x-chunk="dashboard-05-chunk-3">
								<CardHeader className="px-7">
									<CardTitle>Logs</CardTitle>
									<CardDescription>Recent Logs and Activity</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Customer</TableHead>
												<TableHead className="hidden sm:table-cell">
													Type
												</TableHead>
												<TableHead className="hidden sm:table-cell">
													Status
												</TableHead>
												<TableHead className="hidden md:table-cell">
													Date
												</TableHead>
												<TableHead className="text-right">Amount</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow className="bg-accent">
												<TableCell>
													<div className="font-medium">Liam Johnson</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														liam@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Sale
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="secondary">
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-23
												</TableCell>
												<TableCell className="text-right">$250.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Olivia Smith</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														olivia@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Refund
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="outline">
														Declined
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-24
												</TableCell>
												<TableCell className="text-right">$150.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Noah Williams</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														noah@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Subscription
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="secondary">
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-25
												</TableCell>
												<TableCell className="text-right">$350.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Emma Brown</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														emma@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Sale
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="secondary">
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-26
												</TableCell>
												<TableCell className="text-right">$450.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Liam Johnson</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														liam@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Sale
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="secondary">
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-23
												</TableCell>
												<TableCell className="text-right">$250.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Liam Johnson</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														liam@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Sale
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="secondary">
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-23
												</TableCell>
												<TableCell className="text-right">$250.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Olivia Smith</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														olivia@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Refund
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="outline">
														Declined
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-24
												</TableCell>
												<TableCell className="text-right">$150.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className="font-medium">Emma Brown</div>
													<div className="hidden text-sm text-muted-foreground md:inline">
														emma@example.com
													</div>
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													Sale
												</TableCell>
												<TableCell className="hidden sm:table-cell">
													<Badge className="text-xs" variant="secondary">
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													2023-06-26
												</TableCell>
												<TableCell className="text-right">$450.00</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
				{/* Top Performer Employees */}
				<div className="flex flex-col gap-5">
					<Card x-chunk="dashboard-01-chunk-5">
						<CardHeader>
							<CardTitle>Top Employees</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-8">
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/01.png" alt="Avatar" />
									<AvatarFallback>OM</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Olivia Martin
									</p>
									<p className="text-sm text-muted-foreground">
										olivia.martin@email.com
									</p>
								</div>
								<div className="ml-auto font-medium">+$1,999.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/02.png" alt="Avatar" />
									<AvatarFallback>JL</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Jackson Lee
									</p>
									<p className="text-sm text-muted-foreground">
										jackson.lee@email.com
									</p>
								</div>
								<div className="ml-auto font-medium">+$39.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/03.png" alt="Avatar" />
									<AvatarFallback>IN</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Isabella Nguyen
									</p>
									<p className="text-sm text-muted-foreground">
										isabella.nguyen@email.com
									</p>
								</div>
								<div className="ml-auto font-medium">+$299.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/04.png" alt="Avatar" />
									<AvatarFallback>WK</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										William Kim
									</p>
									<p className="text-sm text-muted-foreground">
										will@email.com
									</p>
								</div>
								<div className="ml-auto font-medium">+$99.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/05.png" alt="Avatar" />
									<AvatarFallback>SD</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Sofia Davis
									</p>
									<p className="text-sm text-muted-foreground">
										sofia.davis@email.com
									</p>
								</div>
								<div className="ml-auto font-medium">+$39.00</div>
							</div>
						</CardContent>
					</Card>
					<Card x-chunk="dashboard-05-chunk-1">
						<CardHeader className="pb-2">
							<CardDescription>Active Payroll</CardDescription>
							<CardTitle className="text-4xl">12</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xs text-muted-foreground">
								Confirmed 12 employee / 20
							</div>
						</CardContent>
						<CardFooter>
							<Button>View Reports</Button>
						</CardFooter>
					</Card>
					<Card x-chunk="dashboard-05-chunk-2">
						<CardHeader className="pb-2">
							<CardDescription>Leave Requests</CardDescription>
							<CardTitle className="text-4xl">5</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xs text-muted-foreground">
								+10% from last month
							</div>
						</CardContent>
						<CardFooter>
							<Button>View All</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
