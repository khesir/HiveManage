import { validateServiceID } from '../service.middleware';
import serviceRoute from '../service.route';
import buildRoute from './building/build.route';
import cleaningRoute from './cleaning/cleaning.route';
import repairRoute from './repair/repair.route';
import rentRoute from './rent/rent.route';
import replacementRoute from './replacement/replacement.route';
import upgradeRoute from './upgrade/upgrade.route';

serviceRoute.use('/:service_id/build-details', validateServiceID, buildRoute);

serviceRoute.use(
  '/:service_id/cleaning-details',
  validateServiceID,
  cleaningRoute,
);

serviceRoute.use('/:service_id/rent-details', validateServiceID, rentRoute);

serviceRoute.use('/:service_id/repair-details', validateServiceID, repairRoute);

serviceRoute.use(
  '/:service_id/replacement-details',
  validateServiceID,
  replacementRoute,
);

serviceRoute.use(
  '/:service_id/upgrade-details',
  validateServiceID,
  upgradeRoute,
);
