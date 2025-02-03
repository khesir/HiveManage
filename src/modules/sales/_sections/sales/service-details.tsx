import useServiceFormStore from "@/components/hooks/use-service-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dateParser } from "@/lib/util/utils";
import { Separator } from "@radix-ui/react-separator";
import { File } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ServiceDetails() {
    const navigate = useNavigate();
    const {data} = useServiceFormStore();

    if(!data) {
        return (
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    Not Found
                </CardHeader>
            </Card>
        );
    }
    return (
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        {`#${data.service_id}, ${data.customer}, ${data.service_status}, ${data.created_at}, ${data.has_sales_item}, ${data.has_job_order}, ${data.has_reservation}, ${data.has_borrow}`}
                    </CardTitle>
                    {data && (
                        <CardDescription>
                            Service Made: {dateParser(data.created_at ?? '')}
                        </CardDescription>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => {navigate(`view/${data.service_id}`)}}>
                        <File className="h-3.5 w-3.5"/>
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                            View More
                        </span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="fontt-semibold">Service Information</div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Description</span>
                            <span>{data.service_description}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span>{data.service_status}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sales</span>
                            <span>Sales data...</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4"/>
                <div>
                    <ul className="grid gap-3">
                        <li className="flex items-cener justify-between">
                            <span className="text-muted-foreground">
                                Processed Transactions
                            </span>
                            <span>69</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sales</span>
                            <span>Job Order data...</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sales</span>
                            <span>Reservation data...</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sales</span>
                            <span>Borrow data...</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sales</span>
                            <span>Action Status...</span>
                            <span>Delayed</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}