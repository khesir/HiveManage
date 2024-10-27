/* eslint-disable @typescript-eslint/no-explicit-any */
import {Separator} from '@/components/ui/separator';
import {CreateCustomerForm} from '../../../customer/create/create-customer';
import {Heading} from '@/components/ui/heading'; // Assuming you have a custom Heading component
import {SelectedSaleReviewItems} from '../../../dashboard/salesOverview/selected-sale-review-items';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {SearchCustomer} from '../../../dashboard/salesOverview/customer/search-customer';
import {Button} from '@/components/ui/button';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {useEffect, useState} from 'react';
import {Card} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {useProgressStore} from '@/components/hooks/use-progress-store';
import {CreateServiceProcess} from '../../../dashboard/salesOverview/api/create-service-process';
import {ScrollArea} from '@/components/ui/scroll-area';
export function SalesCreateService() {
	const {salesHookData, setSaleHookData} = useSalesHook();
	const [saving, setSaving] = useState<boolean>(false);
	const {progressList, resetProgress, setProgress} = useProgressStore();
	const [messages, setMessages] = useState<string[]>([]);

	const processCreate = (data: any[]) => {
		setSaleHookData('customer', data, 'append');
		setSaving(true);
		resetProgress();
		CreateServiceProcess(setProgress, salesHookData);
	};
	useEffect(() => {
		if (progressList.length > 0) {
			const lastProgress = progressList[progressList.length - 1];
			setMessages((prevMessages) => [...prevMessages, lastProgress.message]);
		}
	}, [progressList]);
	return (
		<div className="flex flex-col gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Form */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Create Service`}
							description="Fill up the form and complete all the steps, After this we'll be moved to dedicated page for this service"
						/>
					</div>
					{saving ? (
						<Card className="w-full h-[300px] p-5 flex flex-col gap-5">
							{progressList.map((progress, index) => (
								<div key={index}>
									<p>{progress.message}</p>
									<Progress value={progress.value} />
								</div>
							))}
							<ScrollArea className="relative h-[calc(50vh-220px)] rounded-md border p-3">
								{messages.map((msg, index) => (
									<p key={index}>{msg}</p>
								))}
							</ScrollArea>
						</Card>
					) : (
						<>
							<Separator />

							<Tabs defaultValue="item-1">
								<div className="flex items-center justify-between">
									<TabsList>
										<TabsTrigger value="item-1">New Customer</TabsTrigger>
										<TabsTrigger value="item-2">Exisiting Customer</TabsTrigger>
									</TabsList>
									<Button onClick={() => processCreate([])}> Skip </Button>
								</div>
								<TabsContent value="item-1" className="p-5">
									<CreateCustomerForm processCreate={processCreate} />
								</TabsContent>
								<TabsContent value="item-2" className="p-5">
									<SearchCustomer processCreate={processCreate} />
								</TabsContent>
							</Tabs>
						</>
					)}
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Cart */}
					<SelectedSaleReviewItems />
				</div>
			</div>
		</div>
	);
}
