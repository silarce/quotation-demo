import classNames from 'classnames';

import { blurOnWheel } from 'js/utils/helpers/blurOnWheel';

// css
import scss from '../inputSel.module.scss';

export type TinputProps = {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
};

// ==============================================================================
export default function Input({ wrapperClassName, wrapperStyle, props: inputAttr }: TinputProps) {
  return (
    <div className={classNames(scss.inputBox, wrapperClassName)} style={wrapperStyle}>
      <input autoComplete="off" onWheel={blurOnWheel} {...inputAttr} />
    </div>
  );
}
