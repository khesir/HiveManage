import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {MoreVertical} from 'lucide-react';

export function EmployeeEmploymentInformationCard() {
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Employment Information</p>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								className="absolute right-8"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<DropdownMenuItem>Trash</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</AccordionTrigger>
				<AccordionContent>
					<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
						<ul className="grid gap-3">
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Glimmer Lamps x <span>2</span>
								</span>
								<span>$250.00</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Aqua Filters x <span>1</span>
								</span>
								<span>$49.00</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Glimmer Lamps x <span>2</span>
								</span>
								<span>$250.00</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Aqua Filters x <span>1</span>
								</span>
								<span>$49.00</span>
							</li>
						</ul>
					</Card>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
