import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import {Ticket} from 'lucide-react';
import useTicketStore from '../hook/use-ticket-store';
import {dateParser} from '@/lib/util/utils';

export function TaskContent() {
	const {data} = useTicketStore();
	if (!data) {
		return <Card>No data</Card>;
	}
	return (
		<Card>
			<CardHeader className="flex flex-col items-start bg-muted/50">
				<CardTitle className="w-full flex items-center text-lg justify-between">
					<div>{data.title}</div>
					<div className="space-x-2">
						<Button variant={'ghost'}>{dateParser(data.deadline ?? '')}</Button>
						<Button variant={'ghost'}>{data.remarkticket_status}</Button>
					</div>
				</CardTitle>
				<CardDescription>{data.description}</CardDescription>
				<div className="flex items-center gap-1">
					<Button size="sm" variant="default" className="h-8 gap-1">
						<Ticket className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Type 1
						</span>
					</Button>
					<Button size="sm" variant="default" className="h-8 gap-1">
						<Ticket className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Type 1
						</span>
					</Button>
					<Button size="sm" variant="default" className="h-8 gap-1">
						<Ticket className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Type 1
						</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm h-[calc(80vh-180px)] ">
				{data.content ? data.content.markdown : 'Create content'}
			</CardContent>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					Updated{' '}
					<time dateTime="2023-11-23">
						{dateParser(data?.last_updated ?? '')}
					</time>
				</div>
			</CardFooter>
		</Card>
	);
}
