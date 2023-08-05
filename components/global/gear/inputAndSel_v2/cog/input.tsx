import classNames from 'classnames';

// css
import scss from '../inputSel.module.scss';

export type TinputProps = {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
};

// ==============================================================================
export default function Input({ wrapperClassName, wrapperStyle, inputAttr }: TinputProps) {
  return (
    <div className={classNames(scss.inputBox, wrapperClassName)} style={wrapperStyle}>
      <input autoComplete="off" {...inputAttr} />
    </div>
  );
}
