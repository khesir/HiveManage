import {Separator} from '@/components/ui/separator';
import {AppearanceForm} from './subforms/appearance-form';
import {NotificationsForm} from './subforms/notification-form';

export function OtherForm() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Personal Information</h3>
				<p className="text-sm text-muted-foreground">
					Personalization of the application, you can set fonts, themes and
					notification settings here.
				</p>
			</div>
			<Separator />
			<div className="">
				<p className="text-lg font-medium">Apprance</p>
				<div className="m-3">
					<AppearanceForm />
				</div>
			</div>
			<div className="">
				<p className="text-lg font-medium">Notifications</p>
				<div className="m-3">
					<NotificationsForm />
				</div>
			</div>
		</div>
	);
}
