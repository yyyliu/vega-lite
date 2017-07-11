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

      const {name, type, domainRaw: raw, range, ...otherScaleProps} = scaleComponent.combine();
      let domainRaw = raw;  // needs to be mutable

      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        domainRaw = selectionScaleDomain(model, domainRaw);
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
      const domain = mergeDomains(domains);


      scales.push({
        name,
        type,
        domain: domain,
        range: range,
        ...(domainRaw ? {domainRaw} : {}),
        ...otherScaleProps
      });

      return scales;
    }, [] as VgScale[]);
}
