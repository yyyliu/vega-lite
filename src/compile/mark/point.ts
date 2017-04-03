import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {VgGeoPointTransform} from '../../vega.schema';
import {Config} from '../../config';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';
import * as ref from './valueref';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config} = model;

  return {
    ...mixins.pointPosition('x', model, ref.midX(config)),
    ...mixins.pointPosition('y', model, ref.midY(config)),

    ...mixins.color(model),
    ...mixins.nonPosition('size', model),
    ...shapeMixins(model, config, fixedShape),
    ...mixins.nonPosition('opacity', model)
  };
}

function transform(model: UnitModel) {
  let t: VgGeoPointTransform = {
    type: 'geopoint',
    projection: model.projection
  };

  return t;
}

export function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square') {
  if (fixedShape) {
    return {shape: {value: fixedShape}};
  }
  return mixins.nonPosition('shape', model, {defaultValue: getMarkConfig('shape', 'point', config) as string});
}

export const point: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'point',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  },
  transform: (model: UnitModel) => {
    return transform(model);
  }
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'circle',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  },
  transform: (model: UnitModel) => {
    return transform(model);
  }
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'square',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  },
  transform: (model: UnitModel) => {
    return transform(model);
  }
};
