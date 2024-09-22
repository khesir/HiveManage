import { Router } from 'express';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { MessageController } from './message.controller';
import { validateMessageID } from './message.middleware';
import { CreateMessage, UpdateMessage } from './message.model';

const messageRoute = Router({ mergeParams: true });
const messageController = new MessageController(db);

messageRoute.get('/', messageController.getAllMessage.bind(messageController));
log.info('GET /message set');

messageRoute.get(
  '/:message_id',
  validateMessageID,
  messageController.getMessageById.bind(messageController),
);
log.info('GET /message/:message set');

messageRoute.post(
  '/',
  [validateRequest({ body: CreateMessage })],
  messageController.createMessage.bind(messageController),
);
log.info('POST /message/ set ');

messageRoute.put(
  '/:message_id',
  [validateRequest({ body: UpdateMessage }), validateMessageID],
  messageController.updateMessage.bind(messageController),
);
log.info('PUT /message/:message_id set ');

messageRoute.delete(
  '/:message_id',
  validateMessageID,
  messageController.deleteMessage.bind(messageController),
);
log.info('DELETE /message/:message_id set');

export default messageRoute;
