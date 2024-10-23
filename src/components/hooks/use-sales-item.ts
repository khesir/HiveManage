import { Service } from "@/lib/sales-zod-schema";


interface SalesProps {
  selectedService: Service | null;
  setSelectedSales: (sales: Service)
}