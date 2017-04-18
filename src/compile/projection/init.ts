import {X, Y} from '../../channel';
import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {Field, isFieldDef} from '../../fielddef';
import {GEOSHAPE, Mark} from '../../mark';
import {Projection} from '../../projection';
import {LATITUDE, LONGITUDE} from '../../type';

export function initProjection(config: Config, projection: Projection = {}, firstSiblingProjection: Projection = {}, parentProjection: Projection = {}, mark?: Mark, encoding?: Encoding<Field>): Projection {
  const p = {
    ...config.projection,
    ...firstSiblingProjection,
    ...parentProjection,
    ...projection
  } as Projection;

  if (projection || (mark && mark === GEOSHAPE)) {
    return p;
  }

  if (encoding) {
    let latLng = false;
    [X, Y].forEach((channel) => {
      const channelDef = encoding[channel];
      if (isFieldDef(channelDef) && (channelDef.type === LATITUDE || channelDef.type === LONGITUDE)) {
        latLng = true;
      }
    });

    if (latLng) {
      return p;
    }
  }

  return undefined;
}
