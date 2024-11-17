import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {BookUpIcon, Bell, PackageOpen} from 'lucide-react';

export default function OrderSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<div className="flex gap-5">
							<Heading
								title={`Supplier Database`}
								description="Manange Supplier (Server side table functionalities.)"
							/>
						</div>
						<Separator />
					</div>
					<p>Supplier table</p>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					<Card
						x-chunk="dashboard-05-chunk-1"
						className="flex-1 relative overflow-hidden flex flex-col justify-center"
					>
						<CardHeader className="pb-2">
							<CardDescription>Total Products</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">100</CardTitle>
							<div className="text-xs text-muted-foreground">15 are listed</div>
						</CardContent>
						<CardFooter className="space-x-3">
							<Button onClick={() => {}}>
								<BookUpIcon className="mr-2 h-4 w-4" />
								Create Orders
							</Button>
							<Button onClick={() => {}}>
								<Bell className="h-4 w-4" />
							</Button>
						</CardFooter>
						<PackageOpen className="absolute w-[250px] h-[250px] -bottom-5 -right-20 text-slate-700" />
					</Card>
					<p>Supplier Profile</p>
				</div>
			</div>
		</div>
	);
}
