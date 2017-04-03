import {VgGeoShapeTransform} from '../../vega.schema';

import {UnitModel} from '../unit';

import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: undefined,
  encodeEntry: (model: UnitModel) => {
    return {};
  },
  transform: (model: UnitModel) => {
    let t: VgGeoShapeTransform = {
      type: 'geoshape',
      projection: model.projection
    };

    return t;
  }
};
