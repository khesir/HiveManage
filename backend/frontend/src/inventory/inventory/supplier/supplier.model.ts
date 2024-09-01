import { Pool } from 'mysql2/promise';

interface Supplier {
  supplier_id?: number;
  name: string;
  contact_number?: number;
  remarks: string;
  created_at?: Date;
  last_updated?: Date;
}

export class SupplierModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async getAllSupplier(): Promise<Supplier[]> {
    const sql = `SELECT * FROM supplier`;
    const [rows] = await this.db.execute(sql);
    return rows as Supplier[];
  }

  async getSupplierById(supplier_id: number): Promise<Supplier | null> {
    const sql = `SELECT * FROM supplier WHERE supplier_id = ?`;
    const [rows] = await this.db.execute(sql, [supplier_id]);
    const supplier = rows as Supplier[];
    return supplier.length > 0 ? supplier[0] : null;
  }
}
