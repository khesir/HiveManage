import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {SalesInfoCard} from './card/sales-info-card';
import {useEffect, useState} from 'react';
import {ApiRequest, request} from '@/api/axios';
import {useParams} from 'react-router-dom';
import {Sales} from '@/components/validation/sales';
import {toast} from 'sonner';
import {SalesTableList} from './sales-item-table';
import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';

export function SalesTab() {
	const [sales, setSales] = useState<Sales | null>(null);
	const {id} = useParams();
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await request<ApiRequest<Sales>>(
					'GET',
					`/api/v1/sms/sales/${id}`,
				);
				if (!Array.isArray(response.data)) {
					setSales(response.data);
				} else {
					setSales(response.data[0]);
				}
			} catch (error) {
				toast.error(
					`Error fetching sales data: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		};
		fetchProducts();
	}, [id]);
	console.log(sales);
	return (
		<Tabs defaultValue="Informations">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="Informations">
				<div className="flex flex-col sm:gap-4">
					<div className="pt-4 px-4 sm:px-6 space-y-2">
						<Heading
							title={'Sales Details'}
							description={'Overall data for sales and sold items'}
						/>
						<Separator />
					</div>
					<div className="grid flex-1 items-start gap-4 pt-0 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
						<div className="flex flex-col gap-4">
							{sales ? <SalesInfoCard data={sales} /> : <div>skeleton</div>}
						</div>
						<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
							<SalesTableList salesItems={sales?.salesItems ?? []} />
						</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
