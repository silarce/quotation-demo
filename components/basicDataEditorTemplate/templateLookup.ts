import T01 from './t01/t01';
import T02 from './t02/t02';

// ===========================================================================

// type TemplateInstanceProp = Tt01Props | Tt02Props;

// ===========================================================================
const templateLookup = {
  t01: T01,
  t02: T02,
};

// ===========================================================================
// export type { TemplateInstanceProp };
export { templateLookup };
