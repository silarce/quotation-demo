import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import { Ttemplate } from 'components/basicDataEditorTemplate/types';

import scss from './t02.module.scss';

// ===========================================================================

// type Tt02Props = {
//   style?: {
//     [property: string]: string; // React.CSSProperties
//   };
//   titleArr?: string[];
//   a?: TinputSelProps_key[];
//   b?: TinputSelProps_key[];
// };
// type Tt02Props = TemplateProps;

type Tt02 = Ttemplate;

export type { Tt02 };

// ===========================================================================

const T02: Tt02 = ({ style, titles, sections }) => {
  const { a, b } = sections;

  return (
    <div className={scss.t02} style={style}>
      <div className={scss.ab}>
        <p className={scss.title}>{titles?.title01 ?? 'titles.title01'}</p>
        <div className={scss.main}>
          <div className={scss.a}>
            {!a && <span>section a</span>}
            {a?.map((props, index) => {
              const { key, ...rest } = props;

              return <InputSel key={key || index} {...rest} />;
            })}
          </div>
          <div className={scss.pilar}></div>
          <div className={scss.b}>
            {!b && <span>section b</span>}
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
