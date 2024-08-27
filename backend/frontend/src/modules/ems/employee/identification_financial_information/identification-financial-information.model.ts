import { Pool } from 'mysql2/promise';

interface IdentificationFinancialInformation {
    identification_id?: number;
    employee_id: number;
    pag_ibig_id: string;
    sss_id: string;
    philhealth_id: string;
    tin: string;
    bank_account_number: string;
}

export class IdentificationFinancialInformationModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Create new identification financial information
    async createIdentificationFinancialInformation(info: IdentificationFinancialInformation): Promise<number> {
        const sql = `
            INSERT INTO identification_financial_information (
                employee_id, pag_ibig_id, sss_id, philhealth_id, tin, bank_account_number
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await this.db.execute(sql, [
            info.employee_id, info.pag_ibig_id, info.sss_id, info.philhealth_id,
            info.tin, info.bank_account_number
        ]);
        const insertId = (result as any).insertId; // casting result to any to access insertId
        return insertId;
    }

    // Get identification financial information by employee ID
    async getIdentificationFinancialInformationByEmployeeId(employeeId: number): Promise<IdentificationFinancialInformation | null> {
        const sql = `
            SELECT * FROM identification_financial_information WHERE employee_id = ?
        `;
        const [rows] = await this.db.execute(sql, [employeeId]);
        const info = rows as IdentificationFinancialInformation[];
        return info.length > 0 ? info[0] : null;
    }

    // Update identification financial information by ID
    async updateIdentificationFinancialInformationById(id: number, info: IdentificationFinancialInformation): Promise<void> {
        const sql = `
            UPDATE identification_financial_information SET
                employee_id = ?, pag_ibig_id = ?, sss_id = ?, philhealth_id = ?, tin = ?, bank_account_number = ?
            WHERE identification_id = ?
        `;
        await this.db.execute(sql, [
            info.employee_id, info.pag_ibig_id, info.sss_id, info.philhealth_id,
            info.tin, info.bank_account_number, id
        ]);
    }

    // Delete identification financial information by ID
    async deleteIdentificationFinancialInformationById(id: number): Promise<void> {
        const sql = `
            DELETE FROM identification_financial_information WHERE identification_id = ?
        `;
        await this.db.execute(sql, [id]);
    }
}
