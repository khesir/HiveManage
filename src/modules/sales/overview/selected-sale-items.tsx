import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Bell, Trash2} from 'lucide-react';
import {CreateServiceSheet} from './create-service-sheet';
import {useNavigate} from 'react-router-dom';

export function SelectedSaleItems() {
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate('/sales/create-service');
	};
	return (
		<>
			<div className="flex items-center justify-between gap-3">
				<Button className="flex flex-auto">Create Service</Button>

				<div className="space-x-2">
					<Button size={'icon'}>
						<Bell />
					</Button>

					<Button size={'icon'}>
						<Trash2 />
					</Button>
				</div>
			</div>
			<ScrollArea className="relative h-[calc(90vh-220px)] rounded-md border">
				<Card className="absolute top-2 left-4 z-30 w-[90%] px-5 flex justify-between">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1">
							<AccordionTrigger
								value="item-1"
								className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
							>
								<p>Item Listed(10) - PHP 10000</p>
							</AccordionTrigger>
							<AccordionContent>
								<ul className="grid gap-3 grid-cols-3">
									<span className="text-muted-foreground col-span-2">Fees</span>
									<span>10000</span>
									<span className="text-muted-foreground col-span-2">VAT</span>
									<span>0</span>
									<span className="text-muted-foreground col-span-2 flex justify-end mr-5">
										Total
									</span>
									<span>1000</span>
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Card>
				<div className="relative flex flex-col gap-3 z-10 mt-20 mx-3">
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
			<Button className="w-full" onClick={handleNavigate}>
				Confirm
			</Button>
		</>
	);
}
