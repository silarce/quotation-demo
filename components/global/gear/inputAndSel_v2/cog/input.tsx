import classNames from 'classnames';

// css
import scss from '../inputSel.module.scss';

export type TinputProps = {
  wrapperClassName?: string;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
};

// ==============================================================================
export default function Input({ wrapperClassName, inputAttr }: TinputProps) {
  return (
    <div className={classNames(scss.inputBox, wrapperClassName)}>
      <input autoComplete="off" {...inputAttr} />
    </div>
  );
}
