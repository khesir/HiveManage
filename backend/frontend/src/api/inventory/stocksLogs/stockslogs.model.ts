import { z } from 'zod';

export const StockLogsSchema = z.object({
  stock_log_id: z.number().min(1),
  item_id: z.number().min(1),
  quantity: z.number().min(1),
  movement_type: z.string().min(1),
  action: z.string().min(1),
  created_at: z.string().min(1),
});

export type StockLogs = z.infer<typeof StockLogsSchema>;
