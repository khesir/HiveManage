import { Pool } from "mysql2/promise";

interface Designation {
    designation_id?: number;
    title: string;
    status: string;
    created_at?: Date;
    last_updated?: Date;
}

export class DesignationModel {
    private db: Pool;
    
    constructor(db: Pool){
        this.db = db;
    }

    async getAllDesignation() : Promise<Designation[]> {
        const sql = `SELECT * FROM designation`
        const [rows] = await this.db.execute(sql);
        return rows as Designation[];
    }
    async getDesignationById(department_id: number): Promise<Designation | null> {
        const sql = `SELECT * FROM designation WHERE designation_id = ?`;
        const [rows] = await this.db.execute(sql, [department_id]);
        const designation = rows as Designation[];
        return designation.length > 0 ? designation[0] : null;
    }
}