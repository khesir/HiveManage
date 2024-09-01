import { Router } from 'express';
import pool from '../../../../drizzle.config';
import { TagItemController } from './tag_items.controller';

const tagitemRoute = Router({ mergeParams: true });
const tagitemsController = new TagItemController(pool);

tagitemRoute.get(
  '/',
  tagitemsController.getAllTagItems.bind(tagitemsController),
);
tagitemRoute.get(
  '/:id',
  tagitemsController.getTagItemsById.bind(tagitemsController),
);
tagitemRoute.get(
  '/:id',
  tagitemsController.getTagItemsBySupplierId.bind(tagitemsController),
);

export default tagitemRoute;
