import classNames from 'classnames';

// component
import Input, { TinputProps } from '../cog/input';
import MySelect, { TselectProps } from '../cog/mySelect';
import Textarea, { TtextareaProps } from '../cog/textarea';

// css
import scss from './inputSelBar.module.scss';

type TinputPropsWrapper = {
  type: 'input';
  itemProps?: TinputProps;
};
type TselectPropsWrapper = {
  type: 'select';
  itemProps?: TselectProps;
};
type TtextareaPropsWrapper = {
  type: 'textarea';
  itemProps?: TtextareaProps;
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
const InputSelBar = ({
  disabled,
  fontClassName,
  valueContanierClassName,
  propsArr,
  onFocus,
  onBlur,
}: TinputSelBarProps) => {
  return (
    <div className={classNames(scss.valueContainer, valueContanierClassName)}>
      {propsArr.map((item, index) => {
        const { type, itemProps } = item;

        if (type === 'input') {
          return (
            <Input
              key={index}
              wrapperClassName={classNames(fontClassName, itemProps?.wrapperClassName)}
              // wrapperClassName={props?.wrapperClassName}
              inputAttr={{
                disabled,
                ...itemProps?.inputAttr,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  itemProps?.inputAttr?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  itemProps?.inputAttr?.onBlur?.(e);
                },
              }}
            />
          );
        }

        if (type === 'textarea') {
          return (
            <Textarea
              key={index}
              wrapperClassName={itemProps?.wrapperClassName}
              allowNewLineByUser={itemProps?.allowNewLineByUser}
              props={{
                disabled,
                ...itemProps?.props,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  itemProps?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  itemProps?.props?.onBlur?.(e);
                },
                className: classNames(fontClassName, itemProps?.props?.className),
              }}
            />
          );
        }

        if (type === 'select') {
          return (
            <MySelect
              key={index}
              wrapperClassName={itemProps?.wrapperClassName}
              arrowType={itemProps?.arrowType || 'black'}
              fontClassName={fontClassName}
              props={{
                isDisabled: disabled,
                ...itemProps?.props,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  itemProps?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  itemProps?.props?.onBlur?.(e);
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

export default InputSelBar;
