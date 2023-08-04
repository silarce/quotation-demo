import classNames from 'classnames';

// component
import Input, { TinputProps } from '../cog/input';
import MySelect, { TselectProps } from '../cog/mySelect';
import Textarea, { TtextareaProps } from '../cog/textarea';

// css
import scss from './inputSelBar.module.scss';

type TinputPropsWrapper = {
  type: 'input';
  props?: TinputProps;
};
type TselectPropsWrapper = {
  type: 'select';
  props?: TselectProps;
};
type TtextareaPropsWrapper = {
  type: 'textarea';
  props?: TtextareaProps;
};

export type TselInputPropsArr = (TinputPropsWrapper | TselectPropsWrapper | TtextareaPropsWrapper)[];

export type TinputSelBarProps = {
  disabled?: boolean;
  fontClassName?: string;
  valueContanierClassName?: string;
  propsArr: TselInputPropsArr;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
};

// ===========================================================================
const TheBar = ({ disabled, fontClassName, valueContanierClassName, propsArr, onFocus, onBlur }: TinputSelBarProps) => {
  return (
    <div className={classNames(scss.valueContainer, valueContanierClassName)}>
      {propsArr.map((item, index) => {
        const { type, props } = item;

        if (type === 'input') {
          return (
            <Input
              key={index}
              wrapperClassName={classNames(fontClassName, props?.wrapperClassName)}
              // wrapperClassName={props?.wrapperClassName}
              inputAttr={{
                disabled,
                ...props?.inputAttr,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  props?.inputAttr?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  props?.inputAttr?.onBlur?.(e);
                },
              }}
            />
          );
        }

        if (type === 'textarea') {
          return (
            <Textarea
              key={index}
              wrapperClassName={props?.wrapperClassName}
              allowNewLineByUser={props?.allowNewLineByUser}
              props={{
                disabled,
                ...props?.props,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  props?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  props?.props?.onBlur?.(e);
                },
                className: classNames(fontClassName, props?.props?.className),
              }}
            />
          );
        }

        if (type === 'select') {
          return (
            <MySelect
              key={index}
              wrapperClassName={props?.wrapperClassName}
              arrowType={props?.arrowType || 'black'}
              fontClassName={fontClassName}
              props={{
                isDisabled: disabled,
                ...props?.props,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  props?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  props?.props?.onBlur?.(e);
                },
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default TheBar;
