import express from 'express';

import { HttpStatus } from '@/lib/config';

import emsRoute from './ems/index';
import imsRoute from './ims/inventory.route';

import log from '@/lib/logger';
import cmsRoute from './cms/cms.route';
import pmsRoute from './payment/proof.route';
import smsRoute from './sales/sales.route';
import logs from './records/logs.route';

const baseRoute = express.Router({ mergeParams: true });

baseRoute.use('/ems', emsRoute);
log.info('Employee Management System endpoints ready');

// // Inventory Management System API
baseRoute.use('/ims', imsRoute);
log.info('Inventory Management System endpoints ready');

// // Sales Management System API
baseRoute.use('/sms', smsRoute);
log.info('Sales Management System endpoints ready');

// // Payment Management System API
baseRoute.use('/pms', pmsRoute);
log.info('Payment Management System endpoints ready');

// // Customer Management System API
baseRoute.use('/cms', cmsRoute);
log.info('Customer Managment System endpoints ready');

// // Log Management System API
baseRoute.use('/logs', logs);
log.info('Log Management System endpoints ready');

log.info('Loggings Ready');

baseRoute.get('/', (req, res) => {
  res.send({
    status: HttpStatus.OK.code,
    code: HttpStatus.OK.status,
    message: 'PCBEE Backend, v1.0.0 - All Systems Go',
  });
});

export default baseRoute;
