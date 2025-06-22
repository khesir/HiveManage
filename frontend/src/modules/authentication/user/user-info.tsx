import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

export function UserInfo() {
	return (
		<div className="w-full flex items-center gap-2">
			<Avatar className="w-[30px] h-[30px]">
				<AvatarImage
					src="https://github.com/shadcn.png"
					width={30}
					height={30}
				/>
				<AvatarFallback>AA</AvatarFallback>
			</Avatar>
			<div className="text-start">
				<span>Lebron James</span>
				<p className="text-sm text-slate-400">Playing dota</p>
			</div>
		</div>
	);
}
