import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';

import {Product} from '@/components/validation/product';
import clsx from 'clsx';
import {useEffect} from 'react';

interface Props {
	data: Product;
	refreshOnRender: () => void;
}
export function InformationCard({data, refreshOnRender}: Props) {
	useEffect(() => {
		refreshOnRender();
	}, []);
	const avatar = (data.product_suppliers ?? []).map((row) => ({
		name: row.supplier?.name ?? '',
		link:
			typeof row.supplier?.profile_link === 'string'
				? row.supplier.profile_link
				: '',
	}));
	const totalAvatar = avatar.length;
	const numPeople = totalAvatar > 5 ? totalAvatar - 5 : 0;
	return (
		<ScrollArea className="h-full max-h-full grid gap-3">
			<ul className="grid grid-cols-2 gap-3">
				<li className="flex flex-col gap-3 col-span-2">
					<span className=" rounded-sm text-2xl flex items-center gap-3">
						{data.name || ''}{' '}
						<span
							className={clsx(
								'text-white hover:none text-xs py-1 px-2 rounded-xl',
								data.status === 'Available' ? 'bg-green-500' : 'bg-red-500',
							)}
						>
							{data.status === 'Available' ? 'Available' : 'Unavailable'}
						</span>
					</span>
				</li>
				<li className="flex flex-col gap-3 col-span-2">
					<span className=" rounded-sm font-semibold">Product Details</span>
				</li>
				<li className="flex flex-col  text-sm col-span-2">
					<span className="items-start text-muted-foreground border-white text-sm">
						Description
					</span>
					<span className=" rounded-sm">
						{data.product_details?.description || ''}
					</span>
				</li>
				<li className="flex flex-col  text-sm">
					<span className="items-start text-muted-foreground border-white text-sm">
						Price
					</span>
					<span className=" rounded-sm">{data.selling_price || ''}</span>
				</li>
				<li className="flex gap-5 text-sm">
					<span className="text-muted-foreground">Suppliers</span>
					{avatar.length === 0 ? (
						<span>No suppliers</span>
					) : (
						<AvatarCircles numPeople={numPeople} avatar={avatar} />
					)}
				</li>
				<li className="flex gap-5 text-sm">
					<span className="items-start text-muted-foreground border-white text-sm">
						Color
					</span>
					<span className=" rounded-sm">
						{data.product_details?.color || ''}
					</span>
				</li>
				<li className="flex gap-5 text-sm">
					<span className="items-start text-muted-foreground border-white text-sm">
						Size
					</span>
					<span className=" rounded-sm">
						{data.product_details?.size || ''}
					</span>
				</li>
				<li className="flex gap-5 text-sm">
					<span className="items-start text-muted-foreground border-white text-sm">
						Category
					</span>
					<span className="space-x-1">
						{(data.product_categories ?? []).slice(0, 1).map((category) => (
							<Badge key={category.category?.category_id}>
								{category.category?.name}
							</Badge>
						))}
						{(data.product_categories?.length ?? 0) > 1 && (
							<Badge>+{(data.product_categories?.length ?? 0) - 1}</Badge>
						)}
					</span>
				</li>
				<li className="flex gap-5 text-sm">
					<span className="text-muted-foreground">Serialized</span>
					<Badge
						className={clsx(
							'text-white hover:none',
							data.is_serialize ? 'bg-green-500' : 'bg-red-500',
						)}
					>
						{data.is_serialize ? 'True' : 'False'}
					</Badge>
				</li>
			</ul>
		</ScrollArea>
	);
}
