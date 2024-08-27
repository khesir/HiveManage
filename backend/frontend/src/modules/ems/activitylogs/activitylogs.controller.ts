import { Request, Response as ExpressResponse} from 'express';
import { Pool } from 'mysql2/promise';

import { ActivityLogModel } from './activitylogs.model';
import Response from '../../../domain/response';
import { HttpStatus } from '../../../config/config';

export class ActivityLogController {
    private activityLogModel: ActivityLogModel;

    constructor(pool: Pool) {
        this.activityLogModel = new ActivityLogModel(pool);
    }

    // Create a new activity log
    async createActivityLog(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const { employee_id, action } = req.body;
            const activityId = await this.activityLogModel.createActivityLog({ employee_id, action });
            const response = new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, 'Activity log created successfully', { activityId });
            res.status(HttpStatus.CREATED.code).send(response);
        } catch (error) {
            const response = new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Failed to create activity log', null);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    // Get all activity logs
    async getAllActivityLogs(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const activityLogs = await this.activityLogModel.getAllActivityLogs();
            const response = new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Activity logs retrieved successfully', activityLogs);
            res.status(HttpStatus.OK.code).send(response);
        } catch (error) {
            const response = new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Failed to retrieve activity logs', null);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    // Get an activity log by ID
    async getActivityLogById(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const { activity_id } = req.params;
            const activityLog = await this.activityLogModel.getActivityLogById(Number(activity_id));
            if (activityLog) {
                const response = new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Activity log retrieved successfully', activityLog);
                res.status(HttpStatus.OK.code).send(response);
            } else {
                const response = new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'Activity log not found', null);
                res.status(HttpStatus.NOT_FOUND.code).send(response);
            }
        } catch (error) {
            const response = new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Failed to retrieve activity log', null);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }
}