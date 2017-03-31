import {Model} from '../model';

import {PROJECTION_PROPERTIES} from '../../projection';
import {VgProjection} from '../../vega.schema';

/**
 * Parse projection on a model.
 */
export function parseProjection(model: Model): VgProjection {
  const projection = model.projection;

  if (!projection) {
    return null;
  }

  let projectionComponent: VgProjection = {
    name: model.getName('projection'),
    type: projection.type
  };

  PROJECTION_PROPERTIES.forEach((property) => {
    projectionComponent[property] = projection[property];
  });

  return projectionComponent;
}
