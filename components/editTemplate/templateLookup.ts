import T01, { Tt01Props } from './t01/t01';
import T02, { Tt02Props } from './t02/t02';

// ===========================================================================

type TtemplateProps = Tt01Props | Tt02Props;

// ===========================================================================
const templateLookup = {
  t01: T01,
  t02: T02,
};

// ===========================================================================
export type { Tt01Props, Tt02Props, TtemplateProps };
export { templateLookup };
