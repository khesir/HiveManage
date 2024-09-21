import { Router } from 'express';
import log from '../../../lib/logger';
import customerRoute from './customer/customer.route';
import inquiryRoute from './inquiry/inquiry.route';
import messageRoute from './message/message.route';
import channelRoute from './channel/channel.route';

const cmsRoute = Router({ mergeParams: true });

cmsRoute.use('/customer', customerRoute);
log.info('ROUTE customer set ');

cmsRoute.use('/inquiry', inquiryRoute);
log.info('ROUTE inquiry set');

cmsRoute.use('/message', messageRoute);
log.info('ROUTE message set');

cmsRoute.use('/channel', channelRoute);
log.info('ROUTE channel set');

export default cmsRoute;
