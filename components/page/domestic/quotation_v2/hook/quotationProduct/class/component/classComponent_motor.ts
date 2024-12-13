import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_02 } from 'js/utils/options/productOptions';

class ClassCompnent_motor extends ClassCompnent_base<'motor'> implements Interface_ClassComponent_prime {
  readonly key = 'motor' as const;
  readonly name = '馬達機' as const;
  readonly nodeConfig = createNodeConfig_component();
  readonly unit = '組';

  // ------------------------------------------------------------------------

  renewDesc() {
    const {
      //
      horsePower,
      phase: _phase,
      voltage: _voltage,
    } = this.state.rawData ?? {};

    const phase = _phase ? `${_phase}∮` : '';
    const voltage = _voltage ? `${_voltage}V` : '';
    this.state.desc = `${phase} ${voltage} ${horsePower}`;
    this.render();
  }

  // ------------------------------------------------------------------------

  get options_material() {
    return optionsCreator_componentMaterial_02();
  }
}

export { ClassCompnent_motor };
