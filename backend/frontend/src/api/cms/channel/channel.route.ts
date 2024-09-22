import { Router } from 'express';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { ChannelController } from './channel.controller';
import { validateChannelID } from './channel.middleware';
import { CreateChannel, UpdateChannel } from './channel.model';

const channelRoute = Router({ mergeParams: true });
const channelController = new ChannelController(db);

channelRoute.get('/', channelController.getAllChannel.bind(channelController));
log.info('GET /channel set');

channelRoute.get(
  '/:channel_id',
  validateChannelID,
  channelController.getChannelById.bind(channelController),
);
log.info('GET /channel/:channel_id set');

channelRoute.post(
  '/',
  [validateRequest({ body: CreateChannel })],
  channelController.createChannel.bind(channelController),
);
log.info('POST /channel/ set ');

channelRoute.put(
  '/:channel_id',
  [validateRequest({ body: UpdateChannel }), validateChannelID],
  channelController.updateChannel.bind(channelController),
);
log.info('PUT /channel/:channel_id set ');

channelRoute.delete(
  '/:channel_id',
  validateChannelID,
  channelController.deleteChannel.bind(channelController),
);
log.info('DELETE /channel/:channel_id set');

export default channelRoute;
