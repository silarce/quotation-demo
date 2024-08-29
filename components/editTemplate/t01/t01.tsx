import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import type { TinputSelProps_key } from 'components/editTemplate/useInputSelProps';

import scss from './t01.module.scss';

// ===========================================================================
type Tt01Props = {
  style?: {
    [property: string]: string; // React.CSSProperties
  };
  a?: TinputSelProps_key[];
};

type Tt01 = React.FC<Tt01Props>;

export type { Tt01, Tt01Props };

// ===========================================================================

const T01: Tt01 = ({ style, a }: Tt01Props) => {
  return (
    <div className={scss.t01} style={style}>
      {a?.map((props, index) => {
        const { key, ...rest } = props;

        return <InputSel key={key || index} {...rest} />;
      })}
    </div>
  );
};

export default T01;
