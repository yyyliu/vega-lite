import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Field, FieldDef, isFieldDef} from '../../fielddef';
import {VgGeoShapeTransform, VgPostEncodingTransform} from '../../vega.schema';
import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: 'geoshape',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model)
    };
  },
  postEncodingTransform: (model: UnitModel): VgGeoShapeTransform[] => {
    const {encoding} = model;
    const field: FieldDef<Field> = encoding.shape && isFieldDef(encoding.shape) ? encoding.shape.field : undefined;
    return [{
      type: 'geoshape',
      projection: model.getName('projection'),
      as: 'shape',
      ...field ? {field: field} : {},
    } as VgGeoShapeTransform];
  }
};
