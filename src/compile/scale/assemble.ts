import {isArray} from 'vega-util';
import * as log from '../../log';
import {isSelectionDomain} from '../../scale';
import {stringValue, vals} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, VgDataRef, VgScale} from '../../vega.schema';
import {Model} from '../model';
import {isRawSelectionDomain, selectionScaleDomain} from '../selection/selection';
import {mergeDomains} from './domain';


export function assembleScale(model: Model): VgScale[] {
    return vals(model.component.scales).reduce((scales, scaleComponent) => {
      if (scaleComponent.merged) {
        // Skipped merged scales
        return scales;
      }

      // We need to cast here as combine returns Partial<VgScale> by default.
      const scale = scaleComponent.combine(['name', 'type', 'domainRaw', 'range']) as VgScale;

      const domainRaw = scaleComponent.get('domainRaw');
      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        scale.domainRaw = selectionScaleDomain(model, domainRaw);
      }

      const domains = scaleComponent.domains.map(domain => {
        // Correct references to data as the original domain's data was determined
        // in parseScale, which happens before parseData. Thus the original data
        // reference can be incorrect.

        if (isDataRefDomain(domain)) {
          domain.data = model.lookupDataSource(domain.data);
        }
        return domain;
      });

      // domains is an array that has to be merged into a single vega domain
      scale.domain = mergeDomains(domains);
      scales.push(scale);

      return scales;
    }, [] as VgScale[]);
}
