import T01 from './t01/t01';
import T02 from './t02/t02';
import T03 from './t03/t03';

import { Ttemplate } from 'components/basicDataEditorTemplate/types';

// ===========================================================================

// type TemplateInstanceProp = Tt01Props | Tt02Props;

// ===========================================================================
const templateLookup: {
  [name: string]: Ttemplate;
} = {
  t01: T01,
  t02: T02,
  t03: T03,
};

// ===========================================================================
// export type { TemplateInstanceProp };
export { templateLookup };
