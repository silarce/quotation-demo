import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import type { TinputSelProps_key } from 'components/editTemplate/useInputSelProps';

import scss from './t02.module.scss';

// ===========================================================================

type Tt02Props = {
  style?: {
    [property: string]: string; // React.CSSProperties
  };
  title01?: string;
  a?: TinputSelProps_key[];
  b?: TinputSelProps_key[];
};

type Tt02 = React.FC<Tt02Props>;

export type { Tt02Props, Tt02 };

// ===========================================================================

const T02: Tt02 = ({ style, title01, a, b }: Tt02Props) => {
  return (
    <div className={scss.t02} style={style}>
      <div className={scss.ab}>
        <p className={scss.title}>{title01}</p>
        <div className={scss.main}>
          <div className={scss.a}>
            {a?.map((props, index) => {
              const { key, ...rest } = props;

              return <InputSel key={key || index} {...rest} />;
            })}
          </div>
          <div className={scss.pilar}></div>
          <div className={scss.b}>
            {b?.map((props, index) => {
              const { key, ...rest } = props;

              return <InputSel key={key || index} {...rest} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default T02;
