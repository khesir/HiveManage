import {Input} from '@/components/ui/input';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ItemsList} from './items-list';
import {ServiceList} from './services';

export function SalesInhouseTable() {
	return (
		<Tabs defaultValue="Items">
			<div className="flex items-center justify-between">
				<div className="w-[400px]">
					<Input
						placeholder="Search Something"
						className="w-full md:max-w-sm"
					/>
				</div>
				<TabsList>
					<TabsTrigger value="Items">Items</TabsTrigger>
					<TabsTrigger value="Service">Service</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="Items">
				<ItemsList />
			</TabsContent>

			<TabsContent value="Service">
				<ServiceList />
			</TabsContent>
		</Tabs>
	);
}
