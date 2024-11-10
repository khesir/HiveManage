import { Router } from 'express';
import { AuditLogController } from './auditlogs.controller';

import { CreateAuditLog, UpdateAuditLog } from './auditlogs.model';
import {
  validateActivityEmployeeID,
  validateAuditID,
} from './auditlogs.middleware';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';

const auditRoute = Router({ mergeParams: true });

const auditLogsController = new AuditLogController(db);

auditRoute.get(
  '/',
  auditLogsController.getAllAuditLogs.bind(auditLogsController),
);

auditRoute.get(
  '/:auditlog_id',
  validateAuditID,
  auditLogsController.getAuditLogsById.bind(auditLogsController),
);

auditRoute.patch(
  '/',
  [
    validateRequest({
      body: CreateAuditLog,
    }),
    validateActivityEmployeeID,
  ],
  auditLogsController.createAuditLogs.bind(auditLogsController),
);

auditRoute.put(
  '/:auditlog_id',
  [
    validateRequest({
      body: UpdateAuditLog,
    }),
    validateActivityEmployeeID,
    validateAuditID,
  ],
  auditLogsController.updateAuditLogs.bind(auditLogsController),
);

auditRoute.delete(
  '/:auditlog_id',
  validateAuditID,
  auditLogsController.deleteAuditLogbyID.bind(auditLogsController),
);

export default auditRoute;
