import {Button} from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {Product} from '@/components/validation/inventory/product';
import {Separator} from '@radix-ui/react-dropdown-menu';
import {Plus} from 'lucide-react';
interface Props {
	product: Product;
}
export function RecordSheetList({product}: Props) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>
					<Plus className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-w-none w-[700px]">
				<SheetHeader>
					<SheetTitle>{product.name}</SheetTitle>
					<SheetDescription>
						All available items that is under {product.name} product
					</SheetDescription>
					<Separator />
					{/* <CombinedRecord /> */}
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
