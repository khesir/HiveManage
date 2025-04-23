import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet';
import {Scroll} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Ticket} from '@/components/validation/tickets';
import useEventTrigger from '../../_components/use-event-hook';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

interface Props {
	ticket: Ticket;
}
export function TicketSheetList({ticket}: Props) {
	const [sheet, setSheet] = useState<boolean>();
	const {isTriggered} = useEventTrigger();
	useEffect(() => {
		setSheet(false);
	}, [isTriggered]);
	return (
		<Sheet open={sheet} onOpenChange={setSheet}>
			<SheetTrigger asChild>
				<Button>
					<Scroll className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-w-none w-[900px]">
				<ScrollArea className="h-full">
					<SheetHeader className="pb-5">
						<div className="flex gap-5">
							<div>{ticket.title}</div>
						</div>
					</SheetHeader>
					<div className="space-y-5">
						<div className="flex gap-3">
							<Badge>{ticket.ticket_type?.name}</Badge>
							<Badge>{`Deadline: ${ticket.deadline}`}</Badge>
						</div>
						<div className="space-y-2">
							<div>Description</div>
							<Card className="p-5 h-[50vh]">{ticket.description}</Card>
						</div>
						<Card className="p-3">Add Products used</Card>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
