import {useEffect} from 'react';
import useHeaderTitle from './hooks/use-head-title';

interface ContentLayoutProps {
	title: string;
	children: React.ReactNode;
}

export function ContentLayout({title, children}: ContentLayoutProps) {
	const {setTitle} = useHeaderTitle();
	useEffect(() => {
		setTitle(title);
	}, [title]);
	return (
		<div>
			<div className="pt-8 pb-8 px-4 sm:px-8">{children}</div>
		</div>
	);
}
