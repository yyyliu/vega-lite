import {VgProjection} from './vega.schema';

export type ProjectionType = string;
export interface Projection extends VgProjection {}

export const PROJECTION_PROPERTIES: (keyof Projection)[] = [
  'type',
  'center',
  'translate',
  'zoom',
  'rotate',
  'precision',
  'clipAngle',
  'scale',
  'clipExtent'
];
