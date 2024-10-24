import { Router } from 'express';
import { AuditLogController } from './auditlogs.controller';

import { CreateAuditLog, UpdateAuditLog } from './auditlogs.model';
import {
  validateActivityEmployeeID,
  validateAuditID,
} from './auditlogs.middleware';
import { validateRequest } from '@/src/middlewares';
import log from '@/lib/logger';
import { db } from '@/drizzle/pool';

const auditRoute = Router({ mergeParams: true });

const auditLogsController = new AuditLogController(db);

auditRoute.get(
  '/',
  auditLogsController.getAllAuditLogs.bind(auditLogsController),
);
log.info('GET /auditLogs set');

auditRoute.get(
  '/:auditlog_id',
  validateAuditID,
  auditLogsController.getAuditLogsById.bind(auditLogsController),
);
log.info('GET /auditLogs/:auditlog_id set');

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
log.info('POST /auditLogs/ set');

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
log.info('PUT /auditLogs/:auditlog_id set');

auditRoute.delete(
  '/:auditlog_id',
  validateAuditID,
  auditLogsController.deleteAuditLogbyID.bind(auditLogsController),
);
log.info('DELETE /auditLogs/:auditlog_id set');

export default auditRoute;
