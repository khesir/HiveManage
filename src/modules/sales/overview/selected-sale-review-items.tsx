import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Copy, PackageOpenIcon} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function SelectedSaleReviewItems() {
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate(-1);
	};
	return (
		<Card>
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						Service #123
						<Button
							size="icon"
							variant="outline"
							className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<Copy className="h-3 w-3" />
							<span className="sr-only">Copy Order ID</span>
						</Button>
					</CardTitle>
					<CardDescription>Date: November 23, 2023</CardDescription>
				</div>
				<div className="ml-auto flex items-center gap-1">
					<Button
						size="sm"
						variant="default"
						className="h-8 gap-1"
						onClick={handleNavigate}
					>
						<PackageOpenIcon className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Add more
						</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="m-0 p-0 border-y-2">
				<ScrollArea className="relative h-[calc(90vh-220px)]">
					<div className="relative flex flex-col gap-3 z-10 m-3">
						<Card className="w-full h-[100px] flex items-center justify-start overflow-hidden">
							<div className="w-[30%] h-full flex-shrink-0">
								<img
									src={'/img/placeholder.jpg'}
									className="w-full h-full object-top object-cover"
								/>
							</div>
							<CardHeader className="flex-grow">
								<CardTitle className="font-semibold text-sm  hover:underline">
									Item #1
								</CardTitle>
								<CardDescription className="font-semibold text-sm">
									<div className="flex gap-1">PHP 1000</div>
									<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
										qty: 100
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="w-full h-[100px] flex items-center justify-start overflow-hidden">
							<div className="w-[30%] h-full flex-shrink-0">
								<img
									src={'/img/placeholder.jpg'}
									className="w-full h-full object-top object-cover"
								/>
							</div>
							<CardHeader className="flex-grow">
								<CardTitle className="font-semibold text-sm  hover:underline">
									Item #1
								</CardTitle>
								<CardDescription className="font-semibold text-sm">
									<div className="flex gap-1">PHP 1000</div>
									<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
										qty: 100
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="w-full h-[100px] flex items-center justify-start overflow-hidden">
							<div className="w-[30%] h-full flex-shrink-0">
								<img
									src={'/img/placeholder.jpg'}
									className="w-full h-full object-top object-cover"
								/>
							</div>
							<CardHeader className="flex-grow">
								<CardTitle className="font-semibold text-sm  hover:underline">
									Item #1
								</CardTitle>
								<CardDescription className="font-semibold text-sm">
									<div className="flex gap-1">PHP 1000</div>
									<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
										qty: 100
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="w-full h-[100px] flex items-center justify-start overflow-hidden">
							<div className="w-[30%] h-full flex-shrink-0">
								<img
									src={'/img/placeholder.jpg'}
									className="w-full h-full object-top object-cover"
								/>
							</div>
							<CardHeader className="flex-grow">
								<CardTitle className="font-semibold text-sm  hover:underline">
									Item #1
								</CardTitle>
								<CardDescription className="font-semibold text-sm">
									<div className="flex gap-1">PHP 1000</div>
									<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
										qty: 100
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="w-full h-[100px] flex items-center justify-start overflow-hidden">
							<div className="w-[30%] h-full flex-shrink-0">
								<img
									src={'/img/placeholder.jpg'}
									className="w-full h-full object-top object-cover"
								/>
							</div>
							<CardHeader className="flex-grow">
								<CardTitle className="font-semibold text-sm  hover:underline">
									Item #1
								</CardTitle>
								<CardDescription className="font-semibold text-sm">
									<div className="flex gap-1">PHP 1000</div>
									<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
										qty: 100
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="w-full h-[100px] flex items-center justify-start overflow-hidden">
							<div className="w-[30%] h-full flex-shrink-0">
								<img
									src={'/img/placeholder.jpg'}
									className="w-full h-full object-top object-cover"
								/>
							</div>
							<CardHeader className="flex-grow">
								<CardTitle className="font-semibold text-sm  hover:underline">
									Item #1 - Supplier x Model
								</CardTitle>
								<CardDescription className="font-semibold text-sm">
									<div className="flex gap-1">PHP 1000</div>
									<p className="font-semibold text-sm text-slate-500 dark:text-slate-400">
										qty: 100
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
					{/* <Card className="absolute bottom-2 left-4 z-30 w-[90%] px-3 flex justify-center hover:bg-slate-300 cursor-pointer">
					<p className="text-md font-semibold">View more </p>
				</Card> */}
				</ScrollArea>
			</CardContent>
			<CardFooter className=" bg-muted/50 flex flex-col items-start w-full">
				<p className="font-semibold text-md">Item Listed(10) - PHP 10000</p>

				<ul className="grid gap-3 grid-cols-3 w-full">
					<span className="text-muted-foreground col-span-2">Fees</span>
					<span className="font-semibold">10000</span>
					<span className="text-muted-foreground col-span-2">VAT</span>
					<span className="font-semibold">0</span>
					<span className="text-muted-foreground col-span-2 flex justify-end mr-5">
						Total
					</span>
					<span className="font-semibold">1000</span>
				</ul>
			</CardFooter>
		</Card>
	);
}
