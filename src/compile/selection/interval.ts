import {Channel, X, Y} from '../../channel';
import {warn} from '../../log';
import {extend, ifNoName, keys, stringValue} from '../../util';
import {UnitModel} from '../unit';
import {channelSignalName, ProjectComponent, SelectionCompiler, SelectionComponent, STORE, TUPLE} from './selection';
import scales from './transforms/scales';
import {ANCHOR as TRANSLATE_ANCHOR, DELTA as TRANSLATE_DELTA} from './transforms/translate';
import {ANCHOR as ZOOM_ANCHOR} from './transforms/zoom';

export const ACTIVE = '_active',
  BRUSH = '_brush',
  NORM = '_norm';

const interval:SelectionCompiler = {
  predicate: 'vlInterval',

  signals: function(model, selCmpt) {
    const hasScales = scales.has(selCmpt),
        signals: any[] = [],
        intervals:any[] = [],
        name = selCmpt.name;

    if (selCmpt.translate && !hasScales) {
      const filterExpr = `!event.item || event.item.mark.name !== ${stringValue(name + BRUSH)}`;
      events(selCmpt, function(_: any[], evt: any) {
        const filters = evt.between[0].filter || (evt.between[0].filter = []);
        if (filters.indexOf(filterExpr) < 0) {
          filters.push(filterExpr);
        }
      });
    }

    selCmpt.project.forEach(function(p) {
      if (p.encoding !== X && p.encoding !== Y) {
        warn('Interval selections only support x and y encoding channels.');
        return;
      }

      const cs = channelSignals(model, selCmpt, p.encoding),
        csName = channelSignalName(selCmpt, p.encoding, 'data');
      signals.push.apply(signals, cs);
      intervals.push(`{encoding: ${stringValue(p.encoding)}, ` +
      `field: ${stringValue(p.field)}, extent: ${csName}}`);
    });

    if (selCmpt.resolve === 'global' && !hasScales) {
      signals.push({
        name: name + ACTIVE,
        push: 'outer',
        on: [{events: selCmpt.events, update: stringValue(model.getName(''))}]
      });
    }

    return signals.concat({name: name, update: `[${intervals.join(', ')}]`});
  },

  // Always add topLevelSignals for scale pan/zoom normalized delta/anchor signals.
  // This simplifies the bookkeeping the compiler has to do -- the signals always
  // exist even if they're never used.
  topLevelSignals: function(model, selCmpt, signals) {
    const {x, y} = projections(selCmpt);
    let normName = '';
    [TRANSLATE_DELTA, ZOOM_ANCHOR].forEach((name) => {
      if (x !== null) {
        normName = normSignalName(selCmpt, X, name);
        ifNoName(signals, normName, () => signals.push({name: normName}));
      }

      if (y !== null) {
        normName = normSignalName(selCmpt, Y, name);
        ifNoName(signals, normName, () => signals.push({name: normName}));
      }
    });

    ifNoName(signals, TRANSLATE_ANCHOR, () => {
      signals.push({name: TRANSLATE_ANCHOR});
    });

    if (selCmpt.resolve === 'global' && !scales.has(selCmpt)) {
      ifNoName(signals, selCmpt.name + ACTIVE, () => {
        signals.push({name: selCmpt.name + ACTIVE});
      });
    }

    return signals;
  },

  tupleExpr: function(model, selCmpt) {
    return `intervals: ${selCmpt.name}`;
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'true' : `{unit: ${tpl}.unit}`);
  },

  marks: function(model, selCmpt, marks) {
    const name = selCmpt.name,
        {xi, yi} = projections(selCmpt),
        tpl = name + TUPLE,
        store = `data(${stringValue(selCmpt.name + STORE)})`;

    // Do not add a brush if we're binding to scales.
    if (scales.has(selCmpt)) {
      return marks;
    }

    const update = {
      x: extend({}, xi !== null ? {signal: `${name}_x[0]`} : {value: 0}),
      y: extend({}, yi !== null ? {signal: `${name}_y[0]`} : {value: 0}),
      x2: extend({}, xi !== null ? {signal: `${name}_x[1]`} : {field: {group: 'width'}}),
      y2: extend({}, yi !== null ? {signal: `${name}_y[1]`} : {field: {group: 'height'}})
    };

    // If the selection is resolved to global, only a single interval is in
    // the store. Wrap brush mark's encodings with a production rule to test
    // this based on the `unit` property. Hide the brush mark if it corresponds
    // to a unit different from the one in the store.
    if (selCmpt.resolve === 'global') {
      keys(update).forEach(function(key) {
        update[key] = [{
          test: `${name + ACTIVE} === ${stringValue(model.getName(''))}`,
          ...update[key]
        }, {value: 0}];
      });
    }

    // Two brush marks ensure that fill colors and other aesthetic choices do
    // not interefere with the core marks, but that the brushed region can still
    // be interacted with (e.g., dragging it around).
    return [{
      type: 'rect',
      encode: {
        enter: {
          fill: {value: '#333'},
          fillOpacity: {value: 0.125}
        },
        update: update
      }
    } as any].concat(marks, {
      name: name + BRUSH,
      type: 'rect',
      encode: {
        enter: {
          fill: {value: 'transparent'},
          stroke: {value: 'white'}
        },
        update: update
      }
    });
  }
};
export {interval as default};

export function projections(selCmpt: SelectionComponent) {
  let x:ProjectComponent = null, xi:number = null,
      y:ProjectComponent = null, yi: number = null;
  selCmpt.project.forEach(function(p, i) {
    if (p.encoding === X) {
      x  = p;
      xi = i;
    } else if (p.encoding === Y) {
      y = p;
      yi = i;
    }
  });
  return {x, xi, y, yi};
}

function channelSignals(model: UnitModel, selCmpt: SelectionComponent, channel: Channel): any {
  const name = channelSignalName(selCmpt, channel, 'visual'),
      hasScales = scales.has(selCmpt),
      scale = stringValue(model.scaleName(channel)),
      size  = model.getSizeSignalRef(channel === X ? 'width' : 'height').signal,
      coord = `${channel}(unit)`,
      anchor = name + TRANSLATE_ANCHOR,
      panNorm = normSignalName(selCmpt, channel, TRANSLATE_DELTA),
      zoomNorm = normSignalName(selCmpt, channel, ZOOM_ANCHOR),
      zoomAnchor = `(${zoomNorm}.coord * ${size})`;

  let on: any[] = [], signals: any[] = [];

  if (!hasScales) {
    on = events(selCmpt, function(def: any[], evt: any) {
      return def.concat(
        {events: evt.between[0], update: `[${coord}, ${coord}]`},           // Brush start
        {events: evt, update: `[${name}[0], clamp(${coord}, 0, ${size})]`}  // Brush end
      );
    });

    // Ensure brush reacts to norm signals (i.e., panning/zooming of scales
    // by another selection). For globally-resolved intervals, the brush should
    // only react if it is active.
    const condition = selCmpt.resolve !== 'global' ? '' :
        `${selCmpt.name + ACTIVE} !== ${stringValue(model.getName(''))} ? ${name} :`;

    on.push({
      events: {signal: panNorm},
      update: `${condition} [${anchor}[0] + ${size} * ${panNorm}, ` +
        `${anchor}[1] + ${size} * ${panNorm}]`
    }, {
      events: {signal: zoomNorm},
      update: `${condition} [${zoomAnchor} + (${name}[0] - ${zoomAnchor}) / ${zoomNorm}.delta, ` +
        `${zoomAnchor} + (${name}[1] - ${zoomAnchor}) / ${zoomNorm}.delta]`
    });

    signals = [
      {name: name, value: [], on: on},  // Pixel-space signal.
      { name: name + TRANSLATE_ANCHOR,  // Anchor signal to react to norm signals.
        value: [],
        on: [{events: {signal: TRANSLATE_ANCHOR}, update: `slice(${name})`}]
      }
    ];
  }

  // Finally, add the data space signal.
  const dataSg = channelSignalName(selCmpt, channel, 'data');
  return signals.concat({
    name: dataSg,
    on: hasScales ? [] : [
      { events: {signal: name},
        update: `span(${name}) === 0 ? ${dataSg} : invert(${scale}, ${name})`}
    ]
  });
}

function events(selCmpt: SelectionComponent, cb: Function) {
  return selCmpt.events.reduce(function(on: any[], evt: any) {
    if (!evt.between) {
      warn(`${evt} is not an ordered event stream for interval selections`);
      return on;
    }
    return cb(on, evt);
  }, []);
}

export function normSignalName(selCmpt: SelectionComponent, channel: Channel, signal: string) {
  return selCmpt.fields[channel] + signal + NORM;
}
