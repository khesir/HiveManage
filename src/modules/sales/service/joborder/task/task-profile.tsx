import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {Plus, Ticket} from 'lucide-react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Separator} from '@/components/ui/separator';
import {useJoborderStore} from '../hook/useJoborderStore';

export function TaskListProfile() {
	const {joborderData} = useJoborderStore();
	if (!joborderData) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	return (
		<>
			<Button>Edit Ticket</Button>
			<Accordion
				type="single"
				collapsible
				className="w-full border rounded-lg px-2"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger
						value="item-1"
						className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
					>
						<CardHeader className="flex flex-col items-start bg-muted/50 p-3">
							<div className="grid gap-0.5">
								<CardTitle className="group flex items-center gap-2 text-lg">
									{`Joborder #${joborderData?.joborder_id}`}
								</CardTitle>
								<CardDescription className="text-start">
									{joborderData?.uuid}
								</CardDescription>
							</div>
							<div className="flex items-center gap-1">
								<Button size="sm" variant="default" className="h-8 gap-1">
									<Plus className="h-3.5 w-3.5" />
									<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
										Add Item
									</span>
								</Button>
								<Button size="sm" variant="default" className="h-8 gap-1">
									<Ticket className="h-3.5 w-3.5" />
									<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
										Request Item
									</span>
								</Button>
							</div>
						</CardHeader>
					</AccordionTrigger>
					<AccordionContent>
						<Separator className="mb-3" />
						<div className="grid gap-3">
							<div className="font-semibold">Information</div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Service ID</span>
									<span>{joborderData.service.service_id}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Type</span>
									<span>{joborderData.joborder_type.name}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<span>{joborderData.joborder_status}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Service Fee</span>
									<span>{joborderData.fee}</span>
								</li>
							</ul>
						</div>
						<Separator className="my-4" />
						<div>
							<div className="font-semibold">Other Information</div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Employees</span>
									<span>List card Employee...</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Tasks </span>
									<span>1 / 12</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Total Value</span>
									<span>10000</span>
								</li>
							</ul>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}
