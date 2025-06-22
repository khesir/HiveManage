import {Button} from '@/components/ui/button';
import useSettingsFormSelection from '../hooks/settings-form-selection';

interface SidebarNavItem {
	title: string;
}

interface SidebarNavProps {
	items: SidebarNavItem[];
}

export function SidebarNav({items}: SidebarNavProps) {
	const {settings, setSettings} = useSettingsFormSelection();

	const handleItemClick = (itemTitle: string) => {
		setSettings(itemTitle);
	};

	return (
		<div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{items.map((item) => (
				<Button
					key={item.title}
					variant={'ghost'}
					className={`sidebar-item ${settings === item.title ? 'bg-gray-200 dark:bg-white/25' : ''} justify-start`}
					onClick={() => handleItemClick(item.title)}
				>
					{item.title}
				</Button>
			))}
		</div>
	);
}
