import { Pool } from 'mysql2/promise';

interface TagItems {
  item_id?: number;
  supplier_id?: number;
  created_at?: Date;
  last_updated?: Date;
}

export class TagItemsModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async getAllTagItems(): Promise<TagItems[]> {
    const sql = `SELECT * FROM tag_items`;
    const [rows] = await this.db.execute(sql);
    return rows as TagItems[];
  }

  async getTagItemByItemId(itemId: number): Promise<TagItems | null> {
    const sql = `SELECT * FROM tag_items WHERE item_id = ?`;
    const [rows] = await this.db.execute(sql, [itemId]);
    const itemInfo = rows as TagItems[];
    return itemInfo.length > 0 ? itemInfo[0] : null;
  }

  async getTagItemBySupplierId(supplierId: number): Promise<TagItems | null> {
    const sql = `SELECT * FROM tag_items WHERE supplier_id = ?`;
    const [rows] = await this.db.execute(sql, [supplierId]);
    const supplierInfo = rows as TagItems[];
    return supplierInfo.length > 0 ? supplierInfo[0] : null;
  }
}
