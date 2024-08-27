import { Request, Response as ExpressResponse } from 'express';
import { SalaryInformationModel } from './salary_information.model';
import { Pool } from 'mysql2/promise';
import { HttpStatus } from '../../../../config/config';
import Response from '../../../../domain/response';


export class SalaryInformationController {
    private model: SalaryInformationModel;

    constructor(pool: Pool) {
        this.model = new SalaryInformationModel(pool);
    }

    async createSalaryInformation(req: Request, res: ExpressResponse) {
        try {
            const { employee_id, payroll_frequency, base_salary } = req.body;

            if (employee_id === undefined || payroll_frequency === undefined || base_salary === undefined) {
                return res.status(HttpStatus.BAD_REQUEST.code).send(
                    new Response(
                        HttpStatus.BAD_REQUEST.code,
                        HttpStatus.BAD_REQUEST.status,
                        'Missing required fields',
                        null
                    )
                );
            }

            const info = {
                employee_id,
                payroll_frequency,
                base_salary
            };

            const insertId = await this.model.createSalaryInformation(info);
            return res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.status,
                    'Salary information created successfully',
                    { salary_information_id: insertId }
                )
            );
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.status,
                    'Internal server error',
                    null
                )
            );
        }
    }

    async getSalaryInformationByEmployeeId(req: Request, res: ExpressResponse) {
        try {
            const { employeeId } = req.params;
            const salaryInfo = await this.model.getSalaryInformationByEmployeeId(Number(employeeId));

            if (!salaryInfo) {
                return res.status(HttpStatus.NOT_FOUND.code).send(
                    new Response(
                        HttpStatus.NOT_FOUND.code,
                        HttpStatus.NOT_FOUND.status,
                        'Salary information not found',
                        null
                    )
                );
            }

            return res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Salary information retrieved successfully',
                    salaryInfo
                )
            );
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.status,
                    'Internal server error',
                    null
                )
            );
        }
    }

    async updateSalaryInformationById(req: Request, res: ExpressResponse) {
        try {
            const { id } = req.params;
            const { employee_id, payroll_frequency, base_salary } = req.body;

            if (employee_id === undefined || payroll_frequency === undefined || base_salary === undefined) {
                return res.status(HttpStatus.BAD_REQUEST.code).send(
                    new Response(
                        HttpStatus.BAD_REQUEST.code,
                        HttpStatus.BAD_REQUEST.status,
                        'Missing required fields',
                        null
                    )
                );
            }

            const info = {
                employee_id,
                payroll_frequency,
                base_salary
            };

            await this.model.updateSalaryInformationById(Number(id), info);
            return res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Salary information updated successfully',
                    null
                )
            );
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.status,
                    'Internal server error',
                    null
                )
            );
        }
    }

    async deleteSalaryInformationById(req: Request, res: ExpressResponse) {
        try {
            const { id } = req.params;
            await this.model.deleteSalaryInformationById(Number(id));
            return res.status(HttpStatus.NO_CONTENT.code).send(
                new Response(
                    HttpStatus.NO_CONTENT.code,
                    HttpStatus.NO_CONTENT.status,
                    'Salary information deleted successfully',
                    null
                )
            );
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.status,
                    'Internal server error',
                    null
                )
            );
        }
    }
}
