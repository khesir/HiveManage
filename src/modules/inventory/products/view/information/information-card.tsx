import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';

import {Product} from '@/modules/inventory/_components/validation/product';
import clsx from 'clsx';

interface Props {
	data: Product;
}
export function InformationCard({data}: Props) {
	const avatar = (data.product_suppliers ?? []).map((row) => ({
		name: row.supplier?.name ?? '',
		link:
			typeof row.supplier?.profile_link === 'string'
				? row.supplier.profile_link
				: '',
	}));
	return (
		<Card
			x-chunk="dashboard-05-chunk-3"
			className="gap-8 p-4 md:grid h-full w-full"
		>
			<div className="grid gap-3">
				<ul className="grid gap-3">
					<li className="flex flex-col gap-3">
						<span className="items-start text-muted-foreground border-white">
							Description
						</span>
						<span className="p-3 rounded-sm">
							{data.product_detail?.description || ''}
						</span>
					</li>
					<li className="flex items-center justify-between">
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
					<li className="flex items-center justify-between">
						<span className="text-muted-foreground">Serialized Item</span>
						<Badge
							className={clsx(
								'text-white hover:none',
								data.is_serialize ? 'bg-green-500' : 'bg-red-500',
							)}
						>
							{data.is_serialize ? 'True' : 'False'}
						</Badge>
					</li>
					<li className="flex items-center justify-between">
						<span className="text-muted-foreground">Suppliers</span>
						{avatar.length === 0 ? (
							<span>No suppliers</span>
						) : (
							<AvatarCircles numPeople={avatar.length} avatar={avatar} />
						)}
					</li>
				</ul>
			</div>
		</Card>
	);
}
