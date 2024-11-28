import {useEffect, useState} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useSearchParams, useNavigate, useParams} from 'react-router-dom';
import {PaginationResponse, request} from '@/api/axios';
import {Item} from '@/modules/inventory/_components/validation/item';
import {Badge} from '@/components/ui/badge';
import useItemStore from './hook/use-item';

export default function itemList() {
	const [searchParams] = useSearchParams();
	const {id, item_record_id} = useParams();
	const navigate = useNavigate();
	const [pageCount, setPageCount] = useState<number>(0);
	const [item, setItem] = useState<Item[]>([]);

	// Default Params
	const pageLimit = 10;

	const page = Number(searchParams.get('page')) || 1;
	const offset = (page - 1) * pageLimit;
	const sort = searchParams.get('sort') || null;
	const currentPage = offset / pageLimit + 1;
	const {data, setSelectedItem} = useItemStore();
	// Set Filters here
	useEffect(() => {
		const fetchProducts = async () => {
			const res = await request<PaginationResponse<Item>>(
				'GET',
				`/api/v1/ims/product/${id}/item-record/${item_record_id}/item?limit=${pageLimit}&offeset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			console.log(res.data);
			setItem(res.data as Item[]);
		};
		fetchProducts();
	}, []);

	const handlePaginationChange = (newPage: number) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('page', String(newPage));
		newParams.set('limit', String(pageLimit));
		navigate({search: newParams.toString()});
	};
	return (
		<>
			<Card className={`h-[calc(90vh-210px)]`}>
				<ScrollArea className="h-full p-5">
					<div className="flex flex-col gap-3 h-full">
						{item.map((record, index) => (
							<Card
								key={index}
								className={`${data ? 'bg-secondary' : ''} cursor-pointer flex items-center p-5`}
								onClick={() => setSelectedItem(record)}
							>
								<img
									src={
										typeof record.variant?.img_url === 'string'
											? record?.variant?.img_url
											: '/img/placeholder.jpg'
									}
									alt={`${record.variant?.variant_name}`}
									className="rounded-lg w-20 h-20 object-cover border"
								/>
								<CardHeader className="flex gap-2 flex-row justify-between p-2 m-0">
									<div className="flex flex-col items-start w-full">
										<div className="flex gap-3 justify-between w-full items-center">
											<CardTitle className="text-sm">
												{`Variant: ${record.variant?.variant_name}`}
											</CardTitle>
											{/* 
											{item.status === 'Delivered' ||
												(item.status === 'Partially Delivered' && (
													<Checkbox
														onCheckedChange={(isChecked) =>
															handleCheckboxChange(item.product, !!isChecked)
														}
													/>
												))} */}
										</div>
										<div>
											<Badge>{record.item_type}</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent className="flex flex-col items-start text-sm py-0 px-2 m-0 ">
									<CardDescription>
										<p>{`Qty: ${record.quantity}`}</p>
									</CardDescription>
									<CardDescription>
										{' '}
										<p>{`Reorder Level: ${record.reorder_level}`}</p>
									</CardDescription>
								</CardContent>
							</Card>
						))}
						{item.length === 0 && <div>No Items in this record</div>}
					</div>
				</ScrollArea>
			</Card>
			<div className="flex flex-col Products-center justify-between gap-2 space-x-2 py-4 sm:flex-row">
				<div className="flex Products-center justify-center text-sm font-medium">
					Page {currentPage} of {pageCount}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						aria-label="Go to first page"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePaginationChange(1)}
						disabled={currentPage === 1}
					>
						<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to previous page"
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePaginationChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePaginationChange(currentPage + 1)}
						disabled={currentPage === pageCount}
					>
						<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to last page"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePaginationChange(pageCount)}
						disabled={currentPage === pageCount}
					>
						<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</>
	);
}
