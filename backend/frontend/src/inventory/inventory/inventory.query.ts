import { Pool } from 'mysql2/promise';

interface Item {
  item_id?: number;
  name: string;
  description: string;
  quantity: number;
  type: 'Device' | 'Parts';
  item_condition: 'New' | 'Used' | 'Damage';
  created_at?: Date;
  last_updated?: Date;
}

export class ItemModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async create(item: Item): Promise<void> {
    const sql = `INSERT INTO item (name, description, quantity, type, item_condition) 
        VALUES (?, ?, ?, ?, ?)`;
    await this.db.execute(sql, [
      item.name,
      item.description,
      item.quantity,
      item.type,
      item.item_condition,
    ]);
  }

  async findAllItem(): Promise<Item[]> {
    const sql = `SELECT * FROM item`;
    const [rows] = await this.db.execute(sql);
    return rows as Item[];
  }

  async findItemById(id: number): Promise<Item | null> {
    const sql = `SELECT * FROM item WHERE item_id = ?`;
    const [rows] = await this.db.execute(sql, [id]);
    const items = rows as Item[];
    return items.length > 0 ? items[0] : null;
  }

  async updateItemById(id: number, item: Partial<Item>): Promise<void> {
    const sql = `UPDATE employee SET name = ?, description = ?, quantity = ?,
        type = ?, item_condition = ? WHERE item_id = ?`;
    await this.db.execute(sql, [
      item.name,
      item.description,
      item.quantity,
      item.type,
      item.item_condition,
      id,
    ]);
  }

  async deleteItemById(id: number): Promise<void> {
    const sql = `DELETE FROM item WHERE item_id = ?`;
    await this.db.execute(sql, [id]);
  }
}
