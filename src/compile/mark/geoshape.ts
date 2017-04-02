import {UnitModel} from '../unit';

import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: undefined,
  encodeEntry: (model: UnitModel) => {
    return {};
  },
  transform: (model: UnitModel) => {
    return {};
  }
};
