import {selector as parseSelector} from 'vega-event-selector';
import {Channel, X, Y} from '../../../channel';
import {ifNoName, stringValue} from '../../../util';
import {BRUSH as INTERVAL_BRUSH, NORM, normSignalName, projections as intervalProjections} from '../interval';
import {channelSignalName, ProjectComponent, SelectionComponent} from '../selection';
import {UnitModel} from './../../unit';
import {default as scalesCompiler, domain} from './scales';
import {TransformCompiler} from './transforms';

export const ANCHOR = '_translate_anchor',
      DELTA  = '_translate_delta';

const translate:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
  },

  signals: function(model, selCmpt, signals) {
    const name = selCmpt.name,
        hasScales = scalesCompiler.has(selCmpt),
        anchor = name + ANCHOR,
        {x, y} = intervalProjections(selCmpt);
    let events = parseSelector(selCmpt.translate, 'scope');

    if (!hasScales) {
      events = events.map((e) => (e.between[0].markname = name + INTERVAL_BRUSH, e));
    }

    signals.push({
      name: anchor,
      value: {},
      on: [{
        events: events.map((e) => e.between[0]),
        update: '{x: x(unit), y: y(unit)' +
          (x !== null ? ', extent_x: ' + (hasScales ? domain(model, X) :
              `slice(${channelSignalName(selCmpt, 'x', 'visual')})`) : '') +

          (y !== null ? ', extent_y: ' + (hasScales ? domain(model, Y) :
              `slice(${channelSignalName(selCmpt, 'y', 'visual')})`) : '') + '}'
      }]
    }, {
      name: name + DELTA,
      value: {x: 0, y: 0},
      on: [{
        events: events,
        update: `{x: x(unit) - ${anchor}.x, y: y(unit) - ${anchor}.y}`
      }]
    });

    if (x !== null) {
      deltaNormSignal(model, selCmpt, x, events, signals);
      onDelta(model, selCmpt, X, 'width', signals);
    }

    if (y !== null) {
      deltaNormSignal(model, selCmpt, y, events, signals);
      onDelta(model, selCmpt, Y, 'height', signals);
    }

    return signals;
  }
};

export {translate as default};

function deltaNormSignal(model: UnitModel, selCmpt: SelectionComponent, projection: ProjectComponent, events: any[], signals: any[]) {
  if (scalesCompiler.has(selCmpt)) {
    const anchor = selCmpt.name + ANCHOR;
    const anchorNorm = ifNoName(signals, ANCHOR, () => {
      const sg:any = {name: ANCHOR, push: 'outer', on: []};
      return (signals.push(sg), sg);
    });

    anchorNorm.on.push({events: events.map((e) => e.between[0]), update: `${anchor}`},
      {events: events.map((e) => e.between[1]), update: 'null'});

    const delta = selCmpt.name + DELTA,
        deltaNormName = normSignalName(selCmpt, projection.encoding, DELTA),
        size = model.getSizeSignalRef(projection.encoding === X ? 'width' : 'height').signal;

    const deltaNorm = ifNoName(signals, deltaNormName, () => {
      const sg:any = {name: deltaNormName, push: 'outer', on: []};
      return (signals.push(sg), sg);
    });

    deltaNorm.on.push({
      events: {signal: delta},
      update: `${delta}.${projection.encoding} / ${size}`,
      force: true
    });
  }
}

function onDelta(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, size: 'width' | 'height', signals: any[]) {
  const name = selCmpt.name,
      hasScales = scalesCompiler.has(selCmpt),
      signal:any = signals.filter((s:any) => {
        return s.name === channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
      })[0],
      sign = getSign(selCmpt, channel);

  let anchor: string, delta: string, offset: string;
  if (hasScales) {
    anchor = ANCHOR;
    delta  = normSignalName(selCmpt, channel, DELTA);
    offset = `span(${anchor}.extent_${channel}) * ${delta}`;
  } else {
    anchor = name + ANCHOR;
    delta  = name + DELTA;
    offset = `${delta}.${channel}`;
  }

  const extent = `${anchor}.extent_${channel}`,
    range = `[${extent}[0] ${sign} ${offset}, ${extent}[1] ${sign} ${offset}]`;

  signal.on.push({
    events: {signal: delta},
    update: (hasScales ? range : `clampRange(${range}, 0, unit.${size})`)
  });
}

function getSign(selCmpt: SelectionComponent, channel: Channel) {
  if (scalesCompiler.has(selCmpt)) {
    return channel === Y ? '+' : '-';
  }
  return '+';
}
