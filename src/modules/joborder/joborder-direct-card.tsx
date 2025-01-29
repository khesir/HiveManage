import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {useNavigate} from 'react-router-dom';
import {File} from 'lucide-react';
import {useJoborderStore} from '../sales/_components/hooks/use-joborder-store';

export function JoborderDirectCard() {
	const navigate = useNavigate();
	const {joborderData} = useJoborderStore();
	return (
		<Card>
			<CardHeader className="flex flex-col items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`#${joborderData?.joborder_id} ${joborderData?.uuid}`}
					</CardTitle>
					<CardDescription>
						Created date: {dateParser(joborderData?.created_at ?? '')}
					</CardDescription>
				</div>
				<div className="flex items-center gap-1">
					<Button
						size="sm"
						variant="default"
						className="h-8 gap-1"
						onClick={() => {
							navigate(`view/${joborderData?.joborder_id}`);
						}}
					>
						<File className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							View More
						</span>
					</Button>
				</div>
			</CardHeader>
		</Card>
	);
}
