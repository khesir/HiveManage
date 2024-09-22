import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { CategoryController } from './category.controller';
import { validateCategoryID } from './category.middleware';
import { CreateCategory, UpdateCategory } from './category.model';

const categoryRoute = Router({ mergeParams: true });
const categoryController = new CategoryController(db);

categoryRoute.get(
  '/',
  categoryController.getAllCategory.bind(categoryController),
);
log.info('GET /category set');

categoryRoute.get(
  '/:category_id',
  validateCategoryID,
  categoryController.getCategoryById.bind(categoryController),
);
log.info('GET /category/:category_id set');

categoryRoute.post(
  '/',
  [validateRequest({ body: CreateCategory })],
  categoryController.createCategory.bind(categoryController),
);
log.info('POST /category/ set ');

categoryRoute.put(
  '/:category_id',
  [validateRequest({ body: UpdateCategory }), validateCategoryID],
  categoryController.updateCategory.bind(categoryController),
);
log.info('PUT /category/:category_id set ');

categoryRoute.delete(
  '/:category_id',
  validateCategoryID,
  categoryController.deleteCategory.bind(categoryController),
);
log.info('DELETE /category/:category_id set');

export default categoryRoute;
