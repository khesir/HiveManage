import {Button} from '@/components/ui/button';
import {Link, useNavigate} from 'react-router-dom';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {UserInfo} from './user-info';
import {Settings} from 'lucide-react';

export function UserProfile() {
	const navigate = useNavigate();

	const logout = () => {
		navigate('/');
	};
	return (
		<div className="w-full flex items-center justify-between gap-3 bg-slate-800 py-3 px-3">
			<Popover>
				<PopoverTrigger>
					<UserInfo />
				</PopoverTrigger>
				<PopoverContent
					className="bg-slate-900 border-none w-[200px] text-white"
					alignOffset={30}
				>
					<Button onClick={logout}>Logout</Button>
				</PopoverContent>
			</Popover>
			<Link to={'/user/settings'}>
				<Settings />
			</Link>
		</div>
	);
}
