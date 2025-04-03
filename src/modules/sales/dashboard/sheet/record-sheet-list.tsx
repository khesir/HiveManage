import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet';
import {Product} from '@/components/validation/inventory/product';
import {InformationCard} from '@/modules/inventory/products/view/information/information-card';
import BatchRecordList from '@/modules/inventory/products/view/record/batch-record-list';
import SerializeItemRecord from '@/modules/inventory/products/view/record/serialize-item-list';
import {Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
interface Props {
	product: Product;
}
export function RecordSheetList({product}: Props) {
	const [searchParams] = useSearchParams();
	const [sheet, setSheet] = useState<boolean>();
	const {trigger} = useSalesHook();
	useEffect(() => {
		setSheet(false);
	}, [trigger]);
	return (
		<Sheet open={sheet} onOpenChange={setSheet}>
			<SheetTrigger asChild>
				<Button>
					<Plus className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-w-none w-[900px]">
				<ScrollArea className="h-full">
					<div className="px-5">
						<SheetHeader className="pb-5">
							<div className="flex gap-5">
								<div className="relative h-[300px] overflow-hidden rounded-md w-[300px]">
									<img
										src={
											typeof product.img_url === 'string'
												? product.img_url
												: `/img/placeholder.jpg`
										}
										alt="Selected profile"
										className="object-cover h-full w-full"
									/>
								</div>
								<InformationCard data={product} />
							</div>
						</SheetHeader>
						<div>
							{product.is_serialize ? (
								<SerializeItemRecord
									searchParams={searchParams}
									product_id={product.product_id!.toString()}
									showControls={false}
								/>
							) : (
								<BatchRecordList
									searchParams={searchParams}
									product_id={product.product_id!.toString()}
									showControls={false}
								/>
							)}
						</div>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
