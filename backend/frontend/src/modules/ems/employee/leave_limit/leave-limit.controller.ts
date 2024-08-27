import { Request, Response as ExpressResponse } from 'express';
import { Pool } from 'mysql2/promise';
 
import { LeaveLimitModel } from './leave-limit.model';
import { HttpStatus } from '../../../../config/config';
import Response from '../../../../domain/response';

export class LeaveLimitController {
    private model: LeaveLimitModel;

    constructor(pool: Pool) {
        this.model = new LeaveLimitModel(pool);
    }

    async createLeaveLimit(req: Request, res: ExpressResponse) {
        try {
            const { employee_id, limit_count, leaveType } = req.body;

            if (employee_id === undefined || limit_count === undefined || leaveType === undefined) {
                return res.status(HttpStatus.BAD_REQUEST.code).send(
                    new Response(
                        HttpStatus.BAD_REQUEST.code,
                        HttpStatus.BAD_REQUEST.status,
                        'Missing required fields',
                        null
                    )
                );
            }

            const limit = {
                employee_id,
                limit_count,
                leaveType
            };

            const insertId = await this.model.createLeaveLimit(limit);
            return res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.status,
                    'Leave limit created successfully',
                    { leave_limit_id: insertId }
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

    async getLeaveLimitByEmployeeId(req: Request, res: ExpressResponse) {
        try {
            const { employeeId } = req.params;
            const limit = await this.model.getLeaveLimitByEmployeeId(Number(employeeId));

            if (!limit) {
                return res.status(HttpStatus.NOT_FOUND.code).send(
                    new Response(
                        HttpStatus.NOT_FOUND.code,
                        HttpStatus.NOT_FOUND.status,
                        'Leave limit not found',
                        null
                    )
                );
            }

            return res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Leave limit retrieved successfully',
                    limit
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

    async updateLeaveLimitById(req: Request, res: ExpressResponse) {
        try {
            const { id } = req.params;
            const { employee_id, limit_count, leaveType } = req.body;

            if (employee_id === undefined || limit_count === undefined || leaveType === undefined) {
                return res.status(HttpStatus.BAD_REQUEST.code).send(
                    new Response(
                        HttpStatus.BAD_REQUEST.code,
                        HttpStatus.BAD_REQUEST.status,
                        'Missing required fields',
                        null
                    )
                );
            }

            const limit = {
                employee_id,
                limit_count,
                leaveType
            };

            await this.model.updateLeaveLimitById(Number(id), limit);
            return res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Leave limit updated successfully',
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

    async deleteLeaveLimitById(req: Request, res: ExpressResponse) {
        try {
            const { id } = req.params;
            await this.model.deleteLeaveLimitById(Number(id));
            return res.status(HttpStatus.NO_CONTENT.code).send(
                new Response(
                    HttpStatus.NO_CONTENT.code,
                    HttpStatus.NO_CONTENT.status,
                    'Leave limit deleted successfully',
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
