import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { ParticipantsController } from './participants.controller';
import { validateParticipantsID } from './participants.middleware';
import { CreateParticipants, UpdateParticipants } from './participants.model';

const participantsRoute = Router({ mergeParams: true });
const participantsController = new ParticipantsController(db);

participantsRoute.get(
  '/',
  participantsController.getAllParticipants.bind(participantsController),
);
log.info('GET /participants set');

participantsRoute.get(
  '/:participants_id',
  validateParticipantsID,
  participantsController.getParticipantsById.bind(participantsController),
);
log.info('GET /participants/:participants_id set');

participantsRoute.post(
  '/',
  [validateRequest({ body: CreateParticipants })],
  participantsController.createParticipants.bind(participantsController),
);
log.info('POST /participants/ set ');

participantsRoute.put(
  '/:participants_id',
  [validateRequest({ body: UpdateParticipants }), validateParticipantsID],
  participantsController.updateParticipants.bind(participantsController),
);
log.info('PUT /participants/:participants_id set ');

participantsRoute.delete(
  '/:participants_id',
  validateParticipantsID,
  participantsController.deleteParticipants.bind(participantsController),
);
log.info('DELETE /participants/:participants_id set');

export default participantsRoute;
