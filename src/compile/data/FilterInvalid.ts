import {SCALE_CHANNELS} from '../../channel';
import {ScaleType} from '../../scale';
import {contains, Dict, differ, differArray, duplicate, extend, hash, keys, stringValue} from '../../util';
import {VgFilterTransform, VgTransform} from '../../vega.schema';
import {UnitModel} from './../unit';
import {DataFlowNode} from './dataflow';
import {isScaleChannel} from '../../channel'
import {hasContinuousDomain} from '../../scale';
import {QUANTITATIVE, TEMPORAL} from '../../type';;
import {FieldDef} from '../../fielddef';

export class FilterInvalidNode extends DataFlowNode {
  private _filter_null: Dict<FieldDef<String>>;
  private _filter_non_pos: Dict<FieldDef<String>>;

  public clone() {
    return new FilterInvalidNode(extend({}, this._filter_null), extend({}, this._filter_non_pos));
  }

  constructor(filter_null: Dict<FieldDef<String>>, filter_nonpos: Dict<FieldDef<String>>) {
    super();

   this._filter_non_pos = filter_nonpos;
   this._filter_null = filter_null;
  }

  public static make(model: UnitModel) {
    const filter_nonpos = SCALE_CHANNELS.reduce(function(nonPositiveComponent, channel) {
      const scale = model.getScaleComponent(channel);
      if (!scale || !model.field(channel)) {
        // don't set anything
        return nonPositiveComponent;
      }

      if (scale.get('type') === ScaleType.LOG) {
        nonPositiveComponent[model.field(channel)] = model.fieldDef(channel);
      }
      return nonPositiveComponent;
    }, {} as Dict<FieldDef<String>>);

    const filter_nulls = model.reduceFieldDef((aggregator: Dict<FieldDef<string>>, fieldDef, channel) => {
      if (model.config.invalidValues === 'filter' && !fieldDef.aggregate && fieldDef.field) {
        // Vega's aggregate operator already handle invalid values, so we only have to consider non-aggregate field here.

        const scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);
        if (scaleComponent) {
          const scaleType = scaleComponent.get('type');

          // only automatically filter null for continuous domain since discrete domain scales can handle invalid values.
          if (hasContinuousDomain(scaleType)) {
            aggregator[fieldDef.field] = fieldDef;
          }
        }
      }
      return aggregator;
    }, {} as Dict<FieldDef<string>>);


    if (!keys(filter_nulls).length && !keys(filter_nonpos).length) {
      return null;
    }

    return new FilterInvalidNode(filter_nulls, filter_nonpos);
  }

  get filter() {
    let result = {};
    result.concat(this._filter_non_pos);
    result.concat(this._filter_null)
    return result;
  }

  public assemble(): VgTransform[] {
    let filter_nonpos = keys(this._filter_null).filter((field) => {
      // Only filter fields (keys) with value = true
      return this._filter_null[field] !== null;
    }).map(function(field) {
      return {
        type: 'filter',
        expr: 'datum["' + field + '"] > 0'
      } as VgFilterTransform;
    });
    let filter_null = keys(this._filter_null).reduce((_filters, field) => {
      const fieldDef = this._filter_null[field];
      if (fieldDef !== null) {
        _filters.push(`datum[${stringValue(fieldDef.field)}] !== null`);
        if (contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
          // TODO(https://github.com/vega/vega-lite/issues/1436):
          // We can be even smarter and add NaN filter for N,O that are numbers
          // based on the `parse` property once we have it.
          _filters.push(`!isNaN(datum[${stringValue(fieldDef.field)}])`);
        }
      }
      return _filters;
    }, []);

    filter_nonpos.add(filter_null);
    return filter_nonpos;
  }
}
