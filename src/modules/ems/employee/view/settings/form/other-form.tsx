import {Separator} from '@/components/ui/separator';

export function OtherForm() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Personal Information</h3>
				<p className="text-sm text-muted-foreground">
					This is how others will see you on the site.
				</p>
			</div>
			<Separator />
			Other Settings related to employee, will be put here in the future
		</div>
	);
}
