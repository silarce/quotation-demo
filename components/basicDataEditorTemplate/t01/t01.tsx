import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import { TemplateProps } from 'components/basicDataEditorTemplate/templateProp';

import scss from './t01.module.scss';

// ===========================================================================
// type Tt01Props = {
//   style?: {
//     [property: string]: string; // React.CSSProperties
//   };
//   layout?: {
//     a?: TinputSelProps_key[];
//   };
// } & TemplateProps;
// type Tt01Props = TemplateProps;

type Tt01 = React.FC<TemplateProps>;

export type { Tt01 };

// ===========================================================================

const T01: Tt01 = ({ style, sections: layout }) => {
  const { a } = layout;

  return (
    <div className={scss.t01} style={style}>
      {!a && <span>section a</span>}
      {a?.map((props, index) => {
        const { key, ...rest } = props;

        return <InputSel key={key || index} {...rest} />;
      })}
    </div>
  );
};

export default T01;
