import { Pool } from 'mysql2/promise';

interface PersonalInformation {
    personal_information_id?: number;
    employee_id: number;
    birthday: string;
    gender: 'male' | 'female' | 'others';
    phone: string;
    email: string;
    address_line: string;
    postal_code: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    created_at?: Date;
    last_updated?: Date;
}

export class PersonalInformationModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Create new personal information
    async createPersonalInformation(info: PersonalInformation): Promise<number> {
        const sql = `
            INSERT INTO personal_information (
                employee_id, birthday, gender, phone, email, address_line,
                postal_code, emergency_contact_name, emergency_contact_phone, 
                emergency_contact_relationship
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await this.db.execute(sql, [
            info.employee_id, info.birthday, info.gender, info.phone, info.email,
            info.address_line, info.postal_code, info.emergency_contact_name,
            info.emergency_contact_phone, info.emergency_contact_relationship
        ]);
        const insertId = (result as any).insertId; // casting result to any to access insertId
        return insertId;
    }

    // Get personal information by employee ID
    async getPersonalInformationByEmployeeId(employeeId: number): Promise<PersonalInformation | null> {
        const sql = `
            SELECT * FROM personal_information WHERE employee_id = ?
        `;
        const [rows] = await this.db.execute(sql, [employeeId]);
        const personalInfo = rows as PersonalInformation[];
        return personalInfo.length > 0 ? personalInfo[0] : null;
    }

    // Update personal information by ID
    async updatePersonalInformationById(id: number, info: PersonalInformation): Promise<void> {
        const sql = `
            UPDATE personal_information SET
                employee_id = ?, birthday = ?, gender = ?, phone = ?, email = ?,
                address_line = ?, postal_code = ?, emergency_contact_name = ?,
                emergency_contact_phone = ?, emergency_contact_relationship = ?
            WHERE personal_information_id = ?
        `;
        await this.db.execute(sql, [
            info.employee_id, info.birthday, info.gender, info.phone, info.email,
            info.address_line, info.postal_code, info.emergency_contact_name,
            info.emergency_contact_phone, info.emergency_contact_relationship, id
        ]);
    }

    // Delete personal information by ID
    async deletePersonalInformationById(id: number): Promise<void> {
        const sql = `
            DELETE FROM personal_information WHERE personal_information_id = ?
        `;
        await this.db.execute(sql, [id]);
    }
}
